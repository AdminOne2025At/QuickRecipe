import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";

// معالجة الاستجابات غير الناجحة والتقاط رسائل الخطأ
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // محاولة تحليل نص الخطأ المرجع كـ JSON
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(
          `${res.status}: ${errorData.message || errorData.error || JSON.stringify(errorData)}`
        );
      } else {
        // إذا لم يكن JSON، استخدم النص العادي
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
    } catch (parseError) {
      // في حالة فشل تحليل الرد
      if (parseError instanceof Error && parseError.message.includes(`${res.status}:`)) {
        throw parseError;
      }
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  }
}

// تنسيق المسار مع قاعدة API
function formatApiUrl(url: string): string {
  // إذا كان المسار يبدأ بـ / ويتبعه api/، فقد تمت إضافته بالفعل
  if (url.startsWith('/api/')) {
    return url;
  }
  
  // إذا كان يبدأ بـ /، أضف API_BASE_URL قبله
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // إذا لم يبدأ بـ /، أضف / قبله
  return `${API_BASE_URL}/${url}`;
}

// دالة لإرسال طلبات API
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // تنسيق عنوان URL مع قاعدة API
  const formattedUrl = formatApiUrl(url);
  
  console.log(`Sending ${method} request to: ${formattedUrl}`);
  
  const res = await fetch(formattedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// أنواع سلوك عدم التصريح
type UnauthorizedBehavior = "returnNull" | "throw";

// دالة تجلب البيانات لـ React Query
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // تنسيق عنوان URL لمفتاح الاستعلام
    const url = queryKey[0] as string;
    const formattedUrl = formatApiUrl(url);
    
    console.log(`Query fetch from: ${formattedUrl}`);
    
    const res = await fetch(formattedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
