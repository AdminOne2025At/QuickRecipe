import { 
  users, type User, type InsertUser,
  ingredients, type Ingredient, type InsertIngredient,
  userIngredients, type UserIngredient, type InsertUserIngredient,
  recipes, type Recipe, type InsertRecipe,
  recipeCaches, type RecipeCache, type InsertRecipeCache,
  communityPosts, type CommunityPost, type InsertCommunityPost,
  postComments, type PostComment, type InsertPostComment,
  savedRecipes, type SavedRecipe, type InsertSavedRecipe,
  postReports, type PostReport, type InsertPostReport,
  savedPosts, type SavedPost, type InsertSavedPost
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, asc, gt } from "drizzle-orm";

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

  // Saved recipes operations
  getUserSavedRecipes(userId: number): Promise<SavedRecipe[]>;
  getSavedRecipe(id: number): Promise<SavedRecipe | undefined>;
  createSavedRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
  deleteSavedRecipe(id: number): Promise<void>;
  isSavedRecipe(userId: number, recipeData: any): Promise<boolean>;

  // Community posts operations
  getAllCommunityPosts(limit?: number, offset?: number): Promise<CommunityPost[]>;
  getTrendingCommunityPosts(limit?: number): Promise<CommunityPost[]>;
  getRecentCommunityPosts(limit?: number): Promise<CommunityPost[]>;
  getUserPosts(userId: number): Promise<CommunityPost[]>;
  getPostsByType(postType: string, limit?: number): Promise<CommunityPost[]>;
  getCommunityPost(id: number): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: number, post: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined>;
  deleteCommunityPost(id: number): Promise<void>;
  likePost(id: number): Promise<void>;
  
  // Post comments operations
  getPostComments(postId: number): Promise<PostComment[]>;
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  deletePostComment(id: number): Promise<void>;
  
  // Post reports operations
  reportPost(report: InsertPostReport): Promise<PostReport>;
  getPostReports(postId: number): Promise<PostReport[]>;
  getPostReportsCount(postId: number): Promise<number>;
  hasUserReportedPost(userId: number, postId: number): Promise<boolean>;
  getAllReportedPostIds(): Promise<number[]>;
  
  // Saved posts operations
  savePost(savedPost: InsertSavedPost): Promise<SavedPost>;
  unsavePost(userId: number, postId: number): Promise<void>;
  getUserSavedPosts(userId: number): Promise<CommunityPost[]>;
  isPostSaved(userId: number, postId: number): Promise<boolean>;
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
        category: ingredients.category,
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

  // Saved recipes operations
  async getUserSavedRecipes(userId: number): Promise<SavedRecipe[]> {
    const recipes = await db
      .select()
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId))
      .orderBy(desc(savedRecipes.createdAt));
    
    // Parse the recipeData JSON for each recipe
    return recipes.map(recipe => {
      if (typeof recipe.recipeData === 'string') {
        try {
          return {
            ...recipe,
            recipeData: JSON.parse(recipe.recipeData)
          };
        } catch (e) {
          console.error("Error parsing recipeData:", e);
        }
      }
      return recipe;
    });
  }
  
  async getSavedRecipe(id: number): Promise<SavedRecipe | undefined> {
    const [recipe] = await db
      .select()
      .from(savedRecipes)
      .where(eq(savedRecipes.id, id));
    return recipe;
  }
  
  async createSavedRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe> {
    // Ensure recipeData is properly formatted as a JSON string if it's an object
    let formattedRecipe = { ...recipe };
    
    if (typeof formattedRecipe.recipeData === 'object') {
      formattedRecipe.recipeData = JSON.stringify(formattedRecipe.recipeData);
    }
    
    const [newRecipe] = await db
      .insert(savedRecipes)
      .values(formattedRecipe)
      .returning();
    return newRecipe;
  }
  
  async deleteSavedRecipe(id: number): Promise<void> {
    await db
      .delete(savedRecipes)
      .where(eq(savedRecipes.id, id));
  }
  
  async isSavedRecipe(userId: number, recipeData: any): Promise<boolean> {
    // التحقق من وجود وصفة محفوظة بنفس العنوان والمحتوى للمستخدم
    const saved = await db
      .select()
      .from(savedRecipes)
      .where(
        and(
          eq(savedRecipes.userId, userId),
          sql`${savedRecipes.recipeData}->>'title' = ${recipeData.title}`
        )
      );
    
    return saved.length > 0;
  }

  // Community posts operations
  async getAllCommunityPosts(limit = 50, offset = 0): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getTrendingCommunityPosts(limit = 20): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.likes))
      .limit(limit);
  }

  async getRecentCommunityPosts(limit = 20): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
  }

  async getUserPosts(userId: number): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.userId, userId))
      .orderBy(desc(communityPosts.createdAt));
  }

  async getPostsByType(postType: string, limit = 20): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.postType, postType))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
  }

  async getCommunityPost(id: number): Promise<CommunityPost | undefined> {
    const [post] = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, id));
    return post;
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db
      .insert(communityPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateCommunityPost(id: number, post: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined> {
    const [updatedPost] = await db
      .update(communityPosts)
      .set(post)
      .where(eq(communityPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteCommunityPost(id: number): Promise<void> {
    await db
      .delete(communityPosts)
      .where(eq(communityPosts.id, id));
  }

  async likePost(id: number): Promise<void> {
    // الحصول على عدد الإعجابات الحالي
    const [post] = await db
      .select({ likes: communityPosts.likes })
      .from(communityPosts)
      .where(eq(communityPosts.id, id));
      
    if (!post) {
      throw new Error("Post not found");
    }
    
    const currentLikes = post.likes;
    
    // تحديث الإعجابات (+1)
    await db
      .update(communityPosts)
      .set({ 
        likes: currentLikes + 1,
        updatedAt: new Date() 
      })
      .where(eq(communityPosts.id, id));
  }

  // Post comments operations
  async getPostComments(postId: number): Promise<PostComment[]> {
    return await db
      .select()
      .from(postComments)
      .where(eq(postComments.postId, postId))
      .orderBy(asc(postComments.createdAt));
  }

  async createPostComment(comment: InsertPostComment): Promise<PostComment> {
    const [newComment] = await db
      .insert(postComments)
      .values(comment)
      .returning();
    
    // Update the comments count on the post
    await db
      .update(communityPosts)
      .set({ 
        comments: sql`${communityPosts.comments} + 1` 
      })
      .where(eq(communityPosts.id, comment.postId));
      
    return newComment;
  }

  async deletePostComment(id: number): Promise<void> {
    // Get the comment first to know its postId
    const [comment] = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, id));
      
    if (comment) {
      // Delete the comment
      await db
        .delete(postComments)
        .where(eq(postComments.id, id));
        
      // Update the comments count on the post
      await db
        .update(communityPosts)
        .set({ 
          comments: sql`${communityPosts.comments} - 1` 
        })
        .where(eq(communityPosts.id, comment.postId));
    }
  }
  
  // Post reports operations
  async reportPost(report: InsertPostReport): Promise<PostReport> {
    // إنشاء بلاغ جديد
    const [newReport] = await db
      .insert(postReports)
      .values(report)
      .returning();
    
    // تحديث عدد البلاغات في المنشور
    await db
      .update(communityPosts)
      .set({ 
        reports: sql`${communityPosts.reports} + 1`
      })
      .where(eq(communityPosts.id, report.postId));
    
    // التحقق مما إذا وصل عدد البلاغات للحد الأقصى (50)
    // وحذف المنشور تلقائيًا إذا تجاوز هذا الحد
    const [post] = await db
      .select({ reports: communityPosts.reports })
      .from(communityPosts)
      .where(eq(communityPosts.id, report.postId));
    
    if (post && post.reports >= 50) {
      // حذف المنشور تلقائيًا لتجاوز عدد البلاغات الحد المسموح
      await this.deleteCommunityPost(report.postId);
    }
    
    return newReport;
  }
  
  async getPostReports(postId: number): Promise<PostReport[]> {
    return await db
      .select()
      .from(postReports)
      .where(eq(postReports.postId, postId))
      .orderBy(desc(postReports.createdAt));
  }
  
  async getPostReportsCount(postId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postReports)
      .where(eq(postReports.postId, postId));
    
    return result?.count || 0;
  }
  
  async hasUserReportedPost(userId: number, postId: number): Promise<boolean> {
    const [report] = await db
      .select()
      .from(postReports)
      .where(
        and(
          eq(postReports.userId, userId),
          eq(postReports.postId, postId)
        )
      );
    
    return !!report;
  }
  
  async getAllReportedPostIds(): Promise<number[]> {
    // الحصول على جميع المنشورات التي لديها بلاغات (reports > 0)
    const posts = await db
      .select({ id: communityPosts.id })
      .from(communityPosts)
      .where(gt(communityPosts.reports, 0))
      .orderBy(desc(communityPosts.reports));
    
    return posts.map(post => post.id);
  }
  
  // Saved posts operations
  async savePost(savedPost: InsertSavedPost): Promise<SavedPost> {
    const [newSavedPost] = await db
      .insert(savedPosts)
      .values(savedPost)
      .returning();
    
    return newSavedPost;
  }
  
  async unsavePost(userId: number, postId: number): Promise<void> {
    await db
      .delete(savedPosts)
      .where(
        and(
          eq(savedPosts.userId, userId),
          eq(savedPosts.postId, postId)
        )
      );
  }
  
  async getUserSavedPosts(userId: number): Promise<CommunityPost[]> {
    // الحصول على المنشورات المحفوظة للمستخدم مع تفاصيل المنشور كاملة
    const savedPostsWithDetails = await db
      .select({
        post: communityPosts
      })
      .from(savedPosts)
      .innerJoin(communityPosts, eq(savedPosts.postId, communityPosts.id))
      .where(eq(savedPosts.userId, userId))
      .orderBy(desc(savedPosts.createdAt));
    
    // استخراج تفاصيل المنشورات فقط
    return savedPostsWithDetails.map(item => item.post);
  }
  
  async isPostSaved(userId: number, postId: number): Promise<boolean> {
    const [savedPost] = await db
      .select()
      .from(savedPosts)
      .where(
        and(
          eq(savedPosts.userId, userId),
          eq(savedPosts.postId, postId)
        )
      );
    
    return !!savedPost;
  }
}

export const storage = new DatabaseStorage();
