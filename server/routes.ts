import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateRecipes } from "./services/openai";
import { searchYouTubeVideos } from "./services/youtube";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route to fetch recipes based on ingredients
  app.post("/api/recipes", async (req, res) => {
    try {
      const { ingredients } = req.body;

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          message: "Invalid ingredients. Please provide an array of ingredients.",
        });
      }

      // Generate recipes using OpenAI
      const recipesData = await generateRecipes(ingredients);

      if (!recipesData.recipes || !Array.isArray(recipesData.recipes)) {
        return res.status(500).json({
          message: "Failed to generate recipes. Please try again later.",
        });
      }

      // Fetch YouTube videos for each recipe
      const recipesWithVideos = await Promise.all(
        recipesData.recipes.map(async (recipe) => {
          try {
            const videoId = await searchYouTubeVideos(recipe.title + " recipe");
            return { ...recipe, videoId };
          } catch (error) {
            console.error(`Error fetching video for ${recipe.title}:`, error);
            return recipe; // Return recipe without video if there's an error
          }
        })
      );

      return res.json({
        recipes: recipesWithVideos,
        suggestedIngredients: recipesData.suggestedIngredients || [],
      });
    } catch (error) {
      console.error("Error processing recipe request:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request.",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
