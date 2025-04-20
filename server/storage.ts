import { 
  users, type User, type InsertUser,
  ingredients, type Ingredient, type InsertIngredient,
  userIngredients, type UserIngredient, type InsertUserIngredient,
  recipes, type Recipe, type InsertRecipe,
  recipeCaches, type RecipeCache, type InsertRecipeCache
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Expanded interface with CRUD methods for our recipe application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ingredient operations
  getIngredient(id: number): Promise<Ingredient | undefined>;
  getIngredientByName(name: string): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  listIngredients(): Promise<Ingredient[]>;
  
  // User ingredients operations
  getUserIngredients(userId: number): Promise<Ingredient[]>;
  addUserIngredient(userIngredient: InsertUserIngredient): Promise<UserIngredient>;
  removeUserIngredient(userId: number, ingredientId: number): Promise<void>;
  
  // Recipe operations
  getUserRecipes(userId: number): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
  
  // Recipe cache operations
  getRecipeCache(ingredientsKey: string): Promise<RecipeCache | undefined>;
  createRecipeCache(recipeCache: InsertRecipeCache): Promise<RecipeCache>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Ingredient operations
  async getIngredient(id: number): Promise<Ingredient | undefined> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.id, id));
    return ingredient;
  }
  
  async getIngredientByName(name: string): Promise<Ingredient | undefined> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.name, name));
    return ingredient;
  }
  
  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const [newIngredient] = await db
      .insert(ingredients)
      .values(ingredient)
      .returning();
    return newIngredient;
  }
  
  async listIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients);
  }
  
  // User ingredients operations
  async getUserIngredients(userId: number): Promise<Ingredient[]> {
    const result = await db
      .select({
        id: ingredients.id,
        name: ingredients.name,
        createdAt: ingredients.createdAt
      })
      .from(userIngredients)
      .innerJoin(ingredients, eq(userIngredients.ingredientId, ingredients.id))
      .where(eq(userIngredients.userId, userId));
    
    return result;
  }
  
  async addUserIngredient(userIngredient: InsertUserIngredient): Promise<UserIngredient> {
    const [newUserIngredient] = await db
      .insert(userIngredients)
      .values(userIngredient)
      .returning();
    return newUserIngredient;
  }
  
  async removeUserIngredient(userId: number, ingredientId: number): Promise<void> {
    await db
      .delete(userIngredients)
      .where(
        and(
          eq(userIngredients.userId, userId),
          eq(userIngredients.ingredientId, ingredientId)
        )
      );
  }
  
  // Recipe operations
  async getUserRecipes(userId: number): Promise<Recipe[]> {
    return await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId));
  }
  
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));
    return recipe;
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db
      .insert(recipes)
      .values(recipe)
      .returning();
    return newRecipe;
  }
  
  async deleteRecipe(id: number): Promise<void> {
    await db
      .delete(recipes)
      .where(eq(recipes.id, id));
  }
  
  // Recipe cache operations
  async getRecipeCache(ingredientsKey: string): Promise<RecipeCache | undefined> {
    const [cache] = await db
      .select()
      .from(recipeCaches)
      .where(eq(recipeCaches.ingredients, ingredientsKey));
    return cache;
  }
  
  async createRecipeCache(recipeCache: InsertRecipeCache): Promise<RecipeCache> {
    const [newCache] = await db
      .insert(recipeCaches)
      .values(recipeCache)
      .returning();
    return newCache;
  }
}

export const storage = new DatabaseStorage();
