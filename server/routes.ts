import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { generateRecipesDeepSeek } from "./services/deepseek";
import { generateRecipesMealDB } from "./services/mealdb";
import { generateRecipesGemini } from "./services/gemini";
import { searchYouTubeVideos } from "./services/youtube";
import { storage } from "./storage";
import { insertRecipeCacheSchema, insertIngredientSchema, insertUserSchema, insertRecipeSchema } from "@shared/schema";
import { z } from "zod";

// Import types for recipe interface
import type { RecipeResult } from "./services/openai";

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

      // Sort ingredients alphabetically for consistent cache keys
      const sortedIngredients = [...ingredients].sort((a, b) => a.localeCompare(b));
      const ingredientsKey = sortedIngredients.join(',');

      // Check database cache first
      try {
        const cachedResult = await storage.getRecipeCache(ingredientsKey);
        
        if (cachedResult) {
          console.log("Cache hit for ingredients:", ingredientsKey);
          const parsedResult = JSON.parse(cachedResult.result);
          return res.json(parsedResult);
        }
      } catch (cacheError) {
        console.error("Error checking recipe cache:", cacheError);
        // Continue execution if cache check fails
      }

      // Generate recipes using Google Gemini AI (or fallback if API fails)
      let recipesData;
      try {
        recipesData = await generateRecipesGemini(ingredients);

        if (!recipesData.recipes || !Array.isArray(recipesData.recipes) || recipesData.recipes.length === 0) {
          // No recipes found, but we have suggestions
          return res.status(200).json({
            recipes: [],
            suggestedIngredients: recipesData.suggestedIngredients || [
              "طماطم", "بصل", "بطاطس", "دجاج", "أرز", "ثوم", "زيت زيتون", "بيض", "جزر", "فلفل"
            ],
            message: "لم نتمكن من إيجاد وصفات مناسبة للمكونات المدخلة. حاول إضافة المزيد من المكونات الأساسية."
          });
        }
      } catch (recipeError) {
        console.error("Error generating recipes:", recipeError);
        return res.status(200).json({
          recipes: [],
          suggestedIngredients: [
            "طماطم", "بصل", "بطاطس", "دجاج", "أرز", "ثوم", "زيت زيتون", "بيض", "جزر", "فلفل"
          ],
          message: "حدث خطأ أثناء معالجة طلبك. يرجى إضافة المزيد من المكونات أو المحاولة مرة أخرى لاحقًا."
        });
      }

      // Fetch YouTube videos for each recipe that doesn't already have a videoId
      const recipesWithVideos = await Promise.all(
        recipesData.recipes.map(async (recipe: any) => {
          // If the recipe already has a videoId, use it
          if (recipe.videoId) {
            return recipe;
          }
          
          // Otherwise, try to fetch from YouTube API
          try {
            const videoId = await searchYouTubeVideos(recipe.title + " recipe");
            return { ...recipe, videoId };
          } catch (error) {
            console.error(`Error fetching video for ${recipe.title}:`, error);
            return recipe; // Return recipe without video if there's an error
          }
        })
      );

      const responseData = {
        recipes: recipesWithVideos,
        suggestedIngredients: recipesData.suggestedIngredients || [],
      };

      // Cache the result in the database
      try {
        await storage.createRecipeCache({
          ingredients: ingredientsKey,
          result: JSON.stringify(responseData),
        });
      } catch (cacheError) {
        console.error("Error saving recipe cache:", cacheError);
        // Continue execution if caching fails
      }

      return res.json(responseData);
    } catch (error) {
      console.error("Error processing recipe request:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request.",
      });
    }
  });

  // User registration endpoint
  app.post("/api/users/register", async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
      });

      const validatedData = userSchema.parse(req.body);

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user (password would be hashed in a real app)
      const newUser = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password, // In a real app, hash this password!
      });

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("User registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  // User login endpoint
  app.post("/api/users/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(1)
      });

      const validatedData = loginSchema.parse(req.body);
      
      // Find user and check password (would use proper comparison in a real app)
      const user = await storage.getUserByUsername(validatedData.username);
      
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Save a favorite recipe
  app.post("/api/recipes/save", async (req, res) => {
    try {
      // In a real app, get userId from authenticated session
      const { userId, recipe } = req.body;

      if (!userId || !recipe) {
        return res.status(400).json({ message: "Missing userId or recipe data" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save the recipe
      const savedRecipe = await storage.createRecipe({
        userId,
        title: recipe.title,
        description: recipe.description,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        videoId: recipe.videoId,
      });

      return res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      return res.status(500).json({ message: "Failed to save recipe" });
    }
  });

  // Get user's saved recipes
  app.get("/api/users/:userId/recipes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's saved recipes
      const recipes = await storage.getUserRecipes(userId);
      
      // Parse JSON strings back to arrays
      const formattedRecipes = recipes.map(recipe => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients),
        instructions: JSON.parse(recipe.instructions)
      }));

      return res.json(formattedRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Save user ingredients
  app.post("/api/users/:userId/ingredients", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { ingredients } = req.body;
      
      if (isNaN(userId) || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: "Invalid user ID or ingredients" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save each ingredient
      const savedIngredients = await Promise.all(
        ingredients.map(async (ingredientName) => {
          // Check if ingredient exists
          let ingredient = await storage.getIngredientByName(ingredientName);
          
          // Create ingredient if it doesn't exist
          if (!ingredient) {
            ingredient = await storage.createIngredient({ name: ingredientName });
          }
          
          // Link ingredient to user
          await storage.addUserIngredient({
            userId,
            ingredientId: ingredient.id
          });
          
          return ingredient;
        })
      );

      return res.status(201).json(savedIngredients);
    } catch (error) {
      console.error("Error saving ingredients:", error);
      return res.status(500).json({ message: "Failed to save ingredients" });
    }
  });

  // Get user's saved ingredients
  app.get("/api/users/:userId/ingredients", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's saved ingredients
      const userIngredients = await storage.getUserIngredients(userId);
      return res.json(userIngredients);
    } catch (error) {
      console.error("Error fetching user ingredients:", error);
      return res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  // Delete a user's saved ingredient
  app.delete("/api/users/:userId/ingredients/:ingredientId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const ingredientId = parseInt(req.params.ingredientId);
      
      if (isNaN(userId) || isNaN(ingredientId)) {
        return res.status(400).json({ message: "Invalid user ID or ingredient ID" });
      }

      // Remove the ingredient link
      await storage.removeUserIngredient(userId, ingredientId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      return res.status(500).json({ message: "Failed to delete ingredient" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
