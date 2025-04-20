import { pgTable, text, serial, timestamp, integer, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Recipe cache table
export const recipeCaches = pgTable("recipe_caches", {
  id: serial("id").primaryKey(),
  ingredients: text("ingredients").notNull(), // Comma-separated ingredients list
  result: text("result").notNull(), // JSON string of the recipe results
  createdAt: timestamp("created_at").defaultNow().notNull(), // ISO Date string
});

// Recipe cache schemas
export const insertRecipeCacheSchema = createInsertSchema(recipeCaches).omit({
  id: true,
  createdAt: true,
});

export type InsertRecipeCache = z.infer<typeof insertRecipeCacheSchema>;
export type RecipeCache = typeof recipeCaches.$inferSelect;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  userIngredients: many(userIngredients),
}));

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
});

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

// User Ingredients (saved ingredients for users)
export const userIngredients = pgTable("user_ingredients", {
  userId: integer("user_id").notNull().references(() => users.id),
  ingredientId: integer("ingredient_id").notNull().references(() => ingredients.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.ingredientId] }),
  };
});

export const userIngredientsRelations = relations(userIngredients, ({ one }) => ({
  user: one(users, {
    fields: [userIngredients.userId],
    references: [users.id],
  }),
  ingredient: one(ingredients, {
    fields: [userIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export const insertUserIngredientSchema = createInsertSchema(userIngredients).omit({
  createdAt: true,
});

export type InsertUserIngredient = z.infer<typeof insertUserIngredientSchema>;
export type UserIngredient = typeof userIngredients.$inferSelect;

// Recipes table - for user saved/favorite recipes
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(), // JSON string of ingredients
  instructions: text("instructions").notNull(), // JSON string of instructions
  videoId: text("video_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ one }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
}));

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;
