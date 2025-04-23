import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Users, FileText, AlertTriangle, Trash2, Settings, ExternalLink, RefreshCw, BarChart4, Save, Eye, Flag, X, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import translations from "@/lib/translations";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// مكون زر حذف جميع المنشورات
function DeleteAllPostsButton() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);
  const queryClient = useQueryClient();
  
  const deleteAllPostsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/posts/all?adminKey=admin123&confirmDelete=true`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "فشل في حذف جميع المنشورات");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم حذف جميع المنشورات",
        description: `تم حذف ${data.deletedCount} منشور بنجاح من منصة كويك ريسب`,
        variant: "default",
      });
      setIsDialogOpen(false);
      setIsConfirmationChecked(false);
      
      // تحديث جميع استعلامات المنشورات
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في حذف جميع المنشورات",
        description: error.message,
        variant: "destructive",
      });
      setIsConfirmationChecked(false);
    }
  });
  
  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsConfirmationChecked(false);
      }}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="gap-2 w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            حذف جميع المنشورات
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              تحذير: حذف جميع المنشورات
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>هذا الإجراء سيحذف <strong>جميع المنشورات المجتمعية</strong> من منصة كويك ريسب بشكل نهائي.</p>
              <Alert variant="destructive">
                <AlertTitle className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  إجراء لا يمكن التراجع عنه
                </AlertTitle>
                <AlertDescription>
                  لا يمكن استعادة المنشورات بعد حذفها. سيتم حذف جميع المنشورات وتعليقاتها والبلاغات المرتبطة بها.
                </AlertDescription>
              </Alert>
              <div className="flex items-center space-x-2 space-x-reverse mt-4">
                <Checkbox 
                  id="confirm-delete-all" 
                  checked={isConfirmationChecked}
                  onCheckedChange={(checked) => setIsConfirmationChecked(checked as boolean)}
                />
                <Label htmlFor="confirm-delete-all" className="text-red-600 font-medium">
                  أنا أفهم أن هذا الإجراء نهائي ولا يمكن التراجع عنه
                </Label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (isConfirmationChecked) {
                  deleteAllPostsMutation.mutate();
                } else {
                  toast({
                    title: "تأكيد مطلوب",
                    description: "يرجى تأكيد فهمك لعواقب هذا الإجراء",
                    variant: "destructive",
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={!isConfirmationChecked || deleteAllPostsMutation.isPending}
            >
              {deleteAllPostsMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> جاري حذف جميع المنشورات...</>
              ) : (
                "تأكيد حذف جميع المنشورات"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// مكون زر حذف المنشور
function DeletePostButton({ postId, postTitle, onSuccess }: { postId: number, postTitle: string, onSuccess: () => void }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/posts/${postId}?adminKey=admin123`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل في حذف المنشور");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم حذف المنشور",
        description: "تم حذف المنشور بنجاح وإرسال إشعار للمشرفين",
        variant: "default",
      });
      setIsDialogOpen(false);
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في حذف المنشور",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return (
    <>
      <Button 
        size="sm" 
        variant="destructive" 
        className="gap-1"
        onClick={() => setIsDialogOpen(true)}
        disabled={deletePostMutation.isPending}
      >
        {deletePostMutation.isPending ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        حذف المنشور
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المنشور</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف المنشور "<span className="font-bold">{postTitle}</span>"؟
              <br />
              هذا الإجراء نهائي ولا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deletePostMutation.mutate();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePostMutation.isPending ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> جاري الحذف...</>
              ) : (
                "تأكيد الحذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  // التحقق من صلاحيات المشرف
  useEffect(() => {
    console.log("Admin Dashboard - Check Admin Access:", { user });
    
    if (!user) {
      console.log("No user found, redirecting...");
      setLocation("/");
      toast({
        title: translations['accessDenied'][language],
        description: translations['loginRequired'][language],
        variant: "destructive",
      });
    } else if (!user.isAdmin) {
      console.log("User is not admin, redirecting...");
      setLocation("/");
      toast({
        title: translations['accessDenied'][language],
        description: translations['adminOnlyPage'][language],
        variant: "destructive",
      });
    } else {
      console.log("Admin access verified!");
      // إظهار رسالة ترحيب للمشرف
      toast({
        title: translations['adminGreeting'][language],
        description: translations['adminLoginSuccessMessage'][language],
        variant: "default",
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
  
  // استعلام عن البلاغات
  const { 
    data: reportedPosts = [], 
    isLoading: isLoadingReports,
    refetch: refetchReports
  } = useQuery<any[]>({
    queryKey: ['/api/admin/reports'],
    queryFn: async () => {
      const res = await fetch('/api/admin/reports?adminKey=admin123');
      if (!res.ok) {
        throw new Error('فشل في استرجاع البلاغات');
      }
      return res.json();
    },
    enabled: !!user?.isAdmin,
    refetchOnWindowFocus: false
  });
  
  // إحصائيات البلاغات
  const reportsStats = {
    total: reportedPosts.length,
    pending: reportedPosts.filter(post => post.reportCount < 50).length,
    resolved: reportedPosts.filter(post => post.reportCount >= 50).length
  };
  
  if (!user?.isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold">{translations['adminDashboard'][language]}</h1>
        </div>
        <Button 
          onClick={() => setLocation("/")}
          variant="outline"
          className="gap-2"
        >
          {translations['returnToHomepage'][language]}
        </Button>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700 flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2" />
              {translations['posts'][language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {isLoadingPosts ? "..." : recentPosts?.length || 0}
            </div>
            <p className="text-sm text-blue-600 mt-1">{translations['communityPosts'][language]}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              {translations['users'][language]}
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
              {translations['reportsHeader'][language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {reportsStats.total}
            </div>
            <p className="text-sm text-red-600 mt-1">
              {reportsStats.pending} {translations['pendingReports'][language]}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* علامات التبويب */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">{translations['overview'][language]}</TabsTrigger>
          <TabsTrigger value="reports">{translations['reportsTab'][language]}</TabsTrigger>
          <TabsTrigger value="settings">{translations['settings'][language]}</TabsTrigger>
        </TabsList>
        
        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{translations['latestPosts'][language]}</CardTitle>
              <CardDescription>
                {translations['latestPostsDesc'][language]}
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
              <CardTitle>{translations['activityStats'][language]}</CardTitle>
              <CardDescription>
                {translations['activityStatsDesc'][language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{translations['activeUsersPercentage'][language]}</Label>
                    <span className="text-sm">{Math.round((usersStats.active / usersStats.total) * 100)}%</span>
                  </div>
                  <Progress value={(usersStats.active / usersStats.total) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{translations['resolvedReportsPercentage'][language]}</Label>
                    <span className="text-sm">{Math.round((reportsStats.resolved / reportsStats.total) * 100)}%</span>
                  </div>
                  <Progress value={(reportsStats.resolved / reportsStats.total) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
                <h4 className="text-amber-800 font-medium flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-amber-600" />
                  {translations['usageStatistics'][language]}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>البلاغات والمنشورات المبلغ عنها</CardTitle>
                <CardDescription>
                  المنشورات التي قام المستخدمون بالإبلاغ عنها
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetchReports()}
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="py-8 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">جاري تحميل البلاغات...</p>
                </div>
              ) : reportedPosts.length > 0 ? (
                <div className="space-y-4">
                  {reportedPosts.map((report) => {
                    const isPending = report.reportCount < 50;
                    const statusVariant = isPending ? 
                      { bg: "bg-red-50", border: "border-red-100", text: "text-red-800" } : 
                      { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-800" };
                    
                    return (
                      <div 
                        key={report.postId} 
                        className={`border rounded-lg p-4 ${statusVariant.bg} ${statusVariant.border}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${statusVariant.text} mb-1`}>
                              {report.postTitle}
                            </h4>
                            <Badge 
                              variant={isPending ? "destructive" : "outline"}
                              className="mb-2"
                            >
                              <Flag className="h-3 w-3 mr-1" />
                              {report.reportCount} بلاغ
                            </Badge>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isPending ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"
                          }`}>
                            {isPending ? "بانتظار المراجعة" : "بلغ الحد الأقصى"}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>تاريخ المنشور: {new Date(report.createdAt).toLocaleDateString('ar-EG')}</p>
                          {report.reportCount >= 50 && (
                            <Alert className="mt-2 bg-amber-50 text-amber-700 border-amber-200">
                              <AlertTitle className="flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                تنبيه
                              </AlertTitle>
                              <AlertDescription>
                                هذا المنشور بلغ حد البلاغات (50 بلاغ) ويجب مراجعته أو إزالته على الفور.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        <div className="mt-4 flex space-x-2 space-x-reverse">
                          <DeletePostButton 
                            postId={report.postId} 
                            postTitle={report.postTitle || "منشور بدون عنوان"} 
                            onSuccess={refetchReports} 
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setLocation(`/community-posts/${report.postId}`)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            عرض المنشور
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">لا توجد بلاغات حتى الآن</p>
                </div>
              )}
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
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">أدوات إدارة المحتوى</h3>
                <Separator />
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-4">
                  <div>
                    <h4 className="font-medium text-red-800 mb-2 flex items-center">
                      <Trash2 className="h-5 w-5 mr-2 text-red-600" />
                      حذف جميع المنشورات
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      تحذير: هذا الإجراء سيحذف <strong>جميع المنشورات</strong> من منصة كويك ريسب بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <DeleteAllPostsButton />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{translations['adminTools'][language]}</h3>
                <Separator />
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h4 className="text-amber-800 font-medium text-sm mb-2">
                    {translations['currentUserInfo'][language]}
                  </h4>
                  <div className="bg-white p-3 rounded border border-amber-100 text-xs font-mono mb-3 max-h-32 overflow-auto">
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-amber-700 border-amber-200"
                      onClick={() => {
                        // فتح نافذة مساعدة
                        toast({
                          title: translations['adminInfo'][language],
                          description: `${translations['adminStatus'][language]}: ${user?.isAdmin ? translations['active'][language] : translations['inactive'][language]}`,
                          variant: "default"
                        });
                      }}
                    >
                      {translations['showAdminStatus'][language]}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-700 border-red-200"
                      onClick={async () => {
                        try {
                          // إرسال إشعار تسجيل الخروج قبل حذف بيانات المستخدم من التخزين المحلي
                          if (user) {
                            const response = await fetch('/api/login/notify', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                username: user.username || user.displayName || 'مشرف النظام',
                                loginMethod: 'admin',
                                userAgent: navigator.userAgent,
                                isAdmin: true,
                                email: user.email || undefined,
                                isLogout: true // علامة لتمييز أن هذا طلب تسجيل خروج
                              })
                            });
                            console.log('Admin logout notification sent:', await response.json());
                          }
                        } catch (error) {
                          console.error('Failed to send admin logout notification:', error);
                        }
                        
                        // تسجيل الخروج
                        localStorage.removeItem("user");
                        window.location.href = "/";
                        toast({
                          title: translations['loggedOut'][language],
                          description: translations['logoutSuccessMessage'][language],
                          variant: "default"
                        });
                      }}
                    >
                      {translations['logout'][language]}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                {translations['saveSettings'][language]}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}