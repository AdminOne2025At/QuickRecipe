import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const adminLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", {
        username,
        password
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل تسجيل الدخول كمشرف");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم المشرفين",
        variant: "default"
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "يرجى التحقق من اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    adminLoginMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <Shield className="h-5 w-5 mr-2 text-amber-500" />
          تسجيل دخول المشرفين
        </CardTitle>
        <CardDescription className="text-center">
          لوحة التحكم الخاصة بالمشرفين فقط
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username">اسم المستخدم</Label>
            <Input
              id="admin-username"
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">كلمة المرور</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600"
            disabled={adminLoginMutation.isPending}
          >
            {adminLoginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول كمشرف"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}