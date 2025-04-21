import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, FileText, AlertTriangle, Trash2, Settings, ExternalLink, RefreshCw, BarChart4, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // التحقق من صلاحيات المشرف
  useEffect(() => {
    if (!user || !user.isAdmin) {
      setLocation("/");
      toast({
        title: "وصول مرفوض",
        description: "هذه الصفحة مخصصة للمشرفين فقط",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);
  
  // استعلام عن المنشورات
  const { data: recentPosts = [], isLoading: isLoadingPosts } = useQuery<any[]>({
    queryKey: ['/api/community-posts/recent'],
    enabled: !!user?.isAdmin
  });
  
  // استعلام وهمي عن المستخدمين (سيتم تنفيذه لاحقًا)
  const usersStats = {
    total: 48,
    newLastWeek: 12,
    active: 35
  };
  
  // استعلام وهمي عن البلاغات (سيتم تنفيذه لاحقًا) 
  const reportsStats = {
    total: 15,
    pending: 8,
    resolved: 7
  };
  
  if (!user?.isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold">لوحة تحكم المشرفين</h1>
        </div>
        <Button 
          onClick={() => setLocation("/")}
          variant="outline"
          className="gap-2"
        >
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2" />
              المنشورات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {isLoadingPosts ? "..." : recentPosts?.length || 0}
            </div>
            <p className="text-sm text-blue-600 mt-1">منشور في المجتمع</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {usersStats.total}
            </div>
            <p className="text-sm text-green-600 mt-1">
              {usersStats.newLastWeek}+ مستخدم جديد هذا الأسبوع
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2" />
              البلاغات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {reportsStats.total}
            </div>
            <p className="text-sm text-red-600 mt-1">
              {reportsStats.pending} بلاغ في انتظار المراجعة
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* علامات التبويب */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="reports">البلاغات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        
        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>آخر المنشورات</CardTitle>
              <CardDescription>
                آخر المنشورات المضافة إلى منصة كويك ريسيبي
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="py-8 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">جاري تحميل المنشورات...</p>
                </div>
              ) : recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          بواسطة {post.authorName || "مستخدم #" + post.userId} • {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLocation(`/community-posts/${post.id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">لا توجد منشورات حتى الآن</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation("/community-posts")}
              >
                عرض جميع المنشورات
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات النشاط</CardTitle>
              <CardDescription>
                نشاط المستخدمين والمنشورات خلال الأسبوع الماضي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>نسبة المستخدمين النشطين</Label>
                    <span className="text-sm">{Math.round((usersStats.active / usersStats.total) * 100)}%</span>
                  </div>
                  <Progress value={(usersStats.active / usersStats.total) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>نسبة البلاغات المعالجة</Label>
                    <span className="text-sm">{Math.round((reportsStats.resolved / reportsStats.total) * 100)}%</span>
                  </div>
                  <Progress value={(reportsStats.resolved / reportsStats.total) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
                <h4 className="text-amber-800 font-medium flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-amber-600" />
                  اتجاهات الاستخدام
                </h4>
                <p className="text-amber-700 text-sm mt-2">
                  شهدت المنصة زيادة بنسبة 25% في عدد المنشورات الجديدة خلال الأسبوع الماضي.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* البلاغات */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>البلاغات الجديدة</CardTitle>
              <CardDescription>
                البلاغات التي تحتاج إلى مراجعة من المشرفين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsStats.pending > 0 ? (
                  [...Array(reportsStats.pending)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-red-50 border-red-100">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-red-800">
                          بلاغ عن محتوى غير لائق
                        </h4>
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                          بانتظار المراجعة
                        </span>
                      </div>
                      <p className="text-sm text-red-700 mt-2">
                        تم الإبلاغ عن هذا المنشور بسبب محتوى غير مناسب أو مخالف للقواعد.
                      </p>
                      <div className="mt-4 flex space-x-2 space-x-reverse">
                        <Button size="sm" variant="destructive" className="gap-1">
                          <Trash2 className="h-4 w-4" />
                          حذف المنشور
                        </Button>
                        <Button size="sm" variant="outline">
                          تجاهل البلاغ
                        </Button>
                        <Button size="sm" variant="outline">
                          عرض المنشور
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">لا توجد بلاغات جديدة حتى الآن</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>البلاغات السابقة</CardTitle>
              <CardDescription>
                البلاغات التي تمت معالجتها من قبل فريق الإشراف
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsStats.resolved > 0 ? (
                  [...Array(reportsStats.resolved)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">
                          بلاغ عن محتوى غير لائق
                        </h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          تمت المعالجة
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        تم معالجة هذا البلاغ بواسطة أحد المشرفين.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        تاريخ المعالجة: {new Date().toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">لا توجد بلاغات معالجة حتى الآن</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                إعدادات الإشراف
              </CardTitle>
              <CardDescription>
                تخصيص إعدادات الإشراف والمراقبة على المنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات مراقبة المحتوى</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="moderation-ai" className="font-medium">مراقبة المحتوى بالذكاء الاصطناعي</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      فحص المنشورات والتعليقات تلقائيًا باستخدام Gemini AI
                    </p>
                  </div>
                  <Switch id="moderation-ai" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-delete" className="font-medium">الحذف التلقائي للمنشورات</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      حذف المنشورات تلقائيًا بعد وصول عدد البلاغات إلى 50
                    </p>
                  </div>
                  <Switch id="auto-delete" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إعدادات الإشعارات</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="discord-notifications" className="font-medium">إشعارات Discord</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      إرسال إشعارات عن البلاغات الجديدة إلى قناة Discord
                    </p>
                  </div>
                  <Switch id="discord-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      إرسال ملخص يومي بالنشاط إلى البريد الإلكتروني للمشرفين
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}