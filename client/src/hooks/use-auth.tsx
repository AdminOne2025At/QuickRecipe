import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { InsertUser, User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth as useFirebaseAuth } from "@/contexts/AuthContext";

// إعادة تصدير وظيفة useAuth من AuthContext
export function useAuth() {
  return useFirebaseAuth();
}

// تصدير useToast كذلك ليسهل استخدامه
export { useToast };