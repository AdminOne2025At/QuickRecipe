import { Ingredient, RecipeResponse } from "./types";
import { apiRequest } from "./queryClient";

/**
 * Fetch recipes based on provided ingredients
 */
export async function fetchRecipes(ingredients: string[]): Promise<RecipeResponse> {
  try {
    const response = await apiRequest(
      "POST",
      "/api/recipes",
      { ingredients }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
}
