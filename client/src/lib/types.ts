export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  videoId?: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
  suggestedIngredients: string[];
}
