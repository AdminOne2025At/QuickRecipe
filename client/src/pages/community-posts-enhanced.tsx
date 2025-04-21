import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Share, Award, PlusCircle, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReportPostDialog from "@/components/ReportPostDialog";
import SavePostButton from "@/components/SavePostButton";

// نوع البيانات القادمة من قاعدة البيانات
type DbPost = {
  id: number;
  userId: number;
  title: string;
  content: string;
  postType: string;
  imageUrl?: string;
  tags: string[] | string;
  likes: number;
  comments: number;
  shares: number;
  reports: number;
  createdAt: string;
  userName?: string;
  userLevel?: string;
  userAvatar?: string;
};

// نمط البوست المستخدم في واجهة المستخدم
type Post = {
  id: number;
  user: {
    name: string;
    level: string;
    avatar: string;
    initials: string;
    id?: number; // إضافة معرف المستخدم للتحقق من صلاحية الحذف
    isAdmin?: boolean; // إضافة حقل للإشارة إلى كون المستخدم مشرفًا
  };
  title: string;
  content: string;
  postType: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  date: string;
  isOwnPost?: boolean; // إضافة حقل للتحقق مما إذا كان المنشور ملكًا للمستخدم الحالي
};

// استيراد صفحة المنشورات المجتمعية السابقة مع إضافة أزرار الإبلاغ والحفظ
export default function CommunityPosts() {
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("trending");
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const currentUserId = user?.uid ? parseInt(user.uid.substring(0, 8), 16) % 1000 : 1;

  // جلب المنشورات الرائجة
  const { data: trendingPostsData, isLoading: trendingLoading } = useQuery({
    queryKey: ["/api/community-posts/trending"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/community-posts/trending");
      return await res.json();
    }
  });

  // جلب المنشورات الأخيرة
  const { data: recentPostsData, isLoading: recentLoading } = useQuery({
    queryKey: ["/api/community-posts/recent"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/community-posts/recent");
      return await res.json();
    }
  });

  // استرجاع المنشورات التي أُعجب بها المستخدم من LocalStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem('likedPosts');
    if (storedLikes) {
      try {
        setLikedPosts(JSON.parse(storedLikes));
      } catch (e) {
        console.error("Error parsing liked posts from localStorage", e);
      }
    }
  }, []);

  // إنشاء منشور جديد
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const res = await apiRequest("POST", "/api/community-posts", postData);
      return await res.json();
    },
    onSuccess: () => {
      // إعادة تحميل المنشورات
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
      
      // إغلاق نافذة إنشاء المنشور وإعادة ضبط الحقول
      setNewPostOpen(false);
      setPostTitle("");
      setPostContent("");
      setPostTags("");
      setSelectedFile(null);
      
      toast({
        title: isArabic ? "تم إنشاء المنشور" : "Post Created",
        description: isArabic ? "تم نشر المحتوى الخاص بك بنجاح" : "Your post has been published successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: isArabic ? "خطأ في إنشاء المنشور" : "Post Creation Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // تسجيل إعجاب بمنشور
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await apiRequest("POST", `/api/community-posts/${postId}/like`);
      return await res.json();
    },
    onSuccess: (data) => {
      // تحديث قائمة المنشورات
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      
      // إضافة المنشور إلى قائمة الإعجابات المحلية
      const updatedLikes = [...likedPosts, data.id];
      setLikedPosts(updatedLikes);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
    },
    onError: (error: Error) => {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // النصوص المترجمة
  const texts = {
    title: isArabic ? "منشورات المجتمع" : "Community Posts",
    trending: isArabic ? "الأكثر رواجًا" : "Trending",
    recent: isArabic ? "الأحدث" : "Recent",
    following: isArabic ? "المتابَعون" : "Following", 
    challenges: isArabic ? "التحديات" : "Challenges",
    like: isArabic ? "إعجاب" : "Like",
    comment: isArabic ? "تعليق" : "Comment",
    share: isArabic ? "مشاركة" : "Share",
    createPost: isArabic ? "إنشاء منشور جديد" : "Create New Post",
    uploadImage: isArabic ? "رفع صورة" : "Upload Image",
    cancel: isArabic ? "إلغاء" : "Cancel",
    post: isArabic ? "نشر" : "Post",
    postTitle: isArabic ? "عنوان المنشور" : "Post Title",
    postContent: isArabic ? "محتوى المنشور" : "Post Content",
    postTags: isArabic ? "الوسوم (افصل بين الوسوم بفواصل)" : "Tags (separate with commas)",
    photoLabel: isArabic ? "إضافة صورة" : "Add Photo",
    save: isArabic ? "حفظ" : "Save",
    saved: isArabic ? "محفوظ" : "Saved",
    report: isArabic ? "إبلاغ" : "Report"
  };
  
  // جلب معلومات المستخدم من حساب Google
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || "");
      setUserAvatar(user.photoURL || "");
    }
  }, [user]);

  // تحميل المنشورات من الخادم
  useEffect(() => {
    if (trendingPostsData) {
      const userId = user?.id || 0;
      const mappedPosts = (trendingPostsData as DbPost[]).map(post => 
        mapDbPostToUiPost(post, isArabic, userId.toString())
      );
      setTrendingPosts(mappedPosts);
    }
  }, [trendingPostsData, isArabic, user]);

  // تحميل المنشورات الأخيرة من الخادم
  useEffect(() => {
    if (recentPostsData) {
      const userId = user?.id || 0;
      const mappedPosts = (recentPostsData as DbPost[]).map(post => 
        mapDbPostToUiPost(post, isArabic, userId.toString())
      );
      setRecentPosts(mappedPosts);
    }
  }, [recentPostsData, isArabic, user]);
  
  // تحديث المنشورات تلقائياً كل ثانيتين
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // تحديث وقت التحديث
      setLastRefreshTime(new Date());
      
      // تحديث المنشورات من الخادم
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/trending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts/recent"] });
      
      // بطباعة رسالة في وحدة التحكم للإشارة إلى التحديث
      console.log('تم تحديث المنشورات تلقائياً -', new Date().toLocaleTimeString());
    }, 2000); // كل ثانيتين
    
    // تنظيف الفاصل الزمني عند إلغاء تحميل المكون
    return () => clearInterval(refreshInterval);
  }, []);
  
  // تحويل بيانات قاعدة البيانات إلى نموذج Post
  const mapDbPostToUiPost = (dbPost: DbPost, isArabic: boolean, currentUserId?: string): Post => {
    // استخراج الاسم الأول والحرف الأول من الاسم الأخير إن وجد
    const userName = dbPost.userName || (isArabic ? "مستخدم" : "User");
    const nameParts = userName.split(' ');
    const initials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}` 
      : userName.substring(0, 2);

    // التحقق من كون المستخدم مشرفًا (معرف المستخدم = 9999)
    const isAdmin = dbPost.userId === 9999;
    
    // معالجة تاريخ الإنشاء
    const createdAt = new Date(dbPost.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let dateDisplay = '';
    if (diffMins < 60) {
      dateDisplay = isArabic 
        ? `منذ ${diffMins} دقيقة` 
        : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      dateDisplay = isArabic 
        ? `منذ ${diffHours} ساعة` 
        : `${diffHours} hours ago`;
    } else {
      dateDisplay = isArabic 
        ? `منذ ${diffDays} يوم` 
        : `${diffDays} days ago`;
    }
    
    if (diffMins < 5) {
      dateDisplay = isArabic ? "الآن" : "Just now";
    }

    // صورة ضيف فيسبوك للمستخدمين العاديين بدون صورة
    const guestAvatarUrl = "https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg";
    
    // صورة نجمة المشرفين
    const adminStarAvatar = "https://cdn-icons-png.flaticon.com/512/1177/1177428.png";
    
    return {
      id: dbPost.id,
      user: {
        id: dbPost.userId,
        name: userName,
        // تغيير "عضو" أو "Member" إلى "مشرف" أو "Admin" للمشرفين
        level: isAdmin ? (isArabic ? "مشرف" : "Admin") : (dbPost.userLevel || (isArabic ? "عضو" : "Member")),
        // استخدام صورة النجمة للمشرفين
        avatar: isAdmin ? adminStarAvatar : (dbPost.userAvatar || guestAvatarUrl),
        initials: initials.toUpperCase(),
        isAdmin: isAdmin // إضافة حقل للإشارة إلى كون المستخدم مشرفًا
      },
      title: dbPost.title,
      content: dbPost.content,
      postType: dbPost.postType,
      image: dbPost.imageUrl,
      tags: Array.isArray(dbPost.tags) ? dbPost.tags : (dbPost.tags ? dbPost.tags.split(',') : []),
      likes: dbPost.likes || 0,
      comments: dbPost.comments || 0,
      shares: dbPost.shares || 0,
      date: dateDisplay,
      isOwnPost: currentUserId ? dbPost.userId.toString() === currentUserId : false
    };
  };

  // وظيفة لمعالجة إنشاء منشور جديد
  const handleCreatePost = () => {
    // التحقق من وجود العنوان والمحتوى
    if (!postTitle.trim() || !postContent.trim()) {
      return;
    }
    
    // تجهيز الوسوم
    const tagsList = postTags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);
    
    if (tagsList.length === 0) {
      tagsList.push(isArabic ? "وصفة" : "recipe");
    }
    
    // إنشاء كائن المنشور الجديد لإرساله إلى الخادم
    const postData = {
      userId: currentUserId,
      title: postTitle,
      content: postContent,
      postType: "recipe", // النوع الافتراضي هو وصفة
      tags: tagsList, // إرسال المصفوفة مباشرة بدلاً من تحويلها إلى نص
      imageUrl: "", // سنحتاج إلى رفع الصورة إلى خدمة تخزين سحابية في التطبيق الكامل
      userName: userName || (isArabic ? "مستخدم" : "User"),
      userAvatar: userAvatar || "https://i.pravatar.cc/150?img=33",
    };
    
    // إرسال المنشور الجديد إلى الخادم
    createPostMutation.mutate(postData);
    
    // تحويل المستخدم إلى تبويب "الأحدث" لرؤية منشوره بعد إعادة التحميل
    setActiveTab("recent");
  };

  // وظيفة لمعالجة تحميل الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  // وظيفة لعرض بطاقة منشور
  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="overflow-hidden max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-gray-100">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="flex items-center text-lg font-bold">
              {post.user.name}
              {post.user.isAdmin && (
                <Badge className="ml-2 bg-amber-500 text-amber-950" variant="secondary">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  {isArabic ? "موثّق" : "Verified"}
                </Badge>
              )}
              {post.postType === 'challenge' && (
                <Badge className="ml-2 bg-orange-500" variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  {isArabic ? "تحدي" : "Challenge"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {post.user.level} · {post.date}
            </CardDescription>
          </div>
        </div>
        
        {/* خيارات المنشور */}
        <div className="flex items-center gap-1">
          <SavePostButton postId={post.id} variant="ghost" size="sm" showText={false} />
          <ReportPostDialog postId={post.id} />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-line mb-4">{post.content}</p>
        
        {post.image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-3 bg-muted/20">
        <div className="flex gap-4 w-full justify-center md:justify-start">
          <Button 
            variant={likedPosts.includes(post.id) ? "default" : "ghost"}
            size="sm" 
            className={`flex items-center ${
              likedPosts.includes(post.id) 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'text-zinc-600 hover:text-green-600 hover:bg-green-50'
            } transition-colors duration-200`}
            onClick={() => {
              // منع التكرار إذا كان المستخدم قد سجل إعجابه بالفعل
              if (!likedPosts.includes(post.id)) {
                likePostMutation.mutate(post.id);
                toast({
                  title: isArabic ? "أعجبني" : "Liked!",
                  description: isArabic ? "تم تسجيل إعجابك بهذا المنشور" : "Your like has been registered",
                  variant: "default",
                });
              }
            }}
            disabled={likePostMutation.isPending || likedPosts.includes(post.id)}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${likedPosts.includes(post.id) ? 'fill-white' : ''}`} />
            <span className="font-semibold">{post.likes}</span>
            <span className="hidden sm:inline ml-1">{texts.like}</span>
            {likePostMutation.isPending && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
          </Button>
          
          {/* زر الحفظ - في مكان أكثر وضوحًا */}
          <SavePostButton postId={post.id} variant="ghost" size="sm" showText={true} />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-zinc-600 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            onClick={() => {
              // استخدام واجهة المشاركة المدمجة في المتصفح إذا كانت متوفرة
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.content.substring(0, 100) + '...',
                  url: window.location.href
                }).catch((error) => console.log('Error sharing', error));
              } else {
                // نسخ الرابط 
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: isArabic ? "تمت نسخ الرابط" : "Link copied",
                  description: isArabic ? "تم نسخ رابط المنشور إلى الحافظة" : "Post link copied to clipboard",
                });
              }
            }}
          >
            <Share className="h-4 w-4 mr-1" />
            <span>{post.shares}</span>
            <span className="hidden sm:inline ml-1">{texts.share}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-center md:text-right">{texts.title}</h1>
        
        <Button 
          onClick={() => setNewPostOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {texts.createPost}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* سيستخدم زر القائمة العمومي بدلاً من هذا - ولا توجد حاجة لوجود قائمة منسدلة هنا */}
        
        {/* نسخة الشاشات الكبيرة */}
        <div className="hidden md:flex justify-center w-full mb-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger 
              value="trending" 
              className="text-sm"
            >
              {texts.trending}
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="text-sm"
            >
              {texts.recent}
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="text-sm"
            >
              {texts.following}
            </TabsTrigger>
            <TabsTrigger 
              value="challenges" 
              className="text-sm"
            >
              {texts.challenges}
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* نسخة الشاشات الصغيرة */}
        <div className="flex md:hidden justify-center w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger 
              value="trending" 
              className="text-sm"
            >
              {texts.trending}
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="text-sm"
            >
              {texts.recent}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="trending" className="space-y-6">
          {trendingLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map(post => (
              <div key={post.id} className="mb-8">
                {renderPostCard(post)}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p>{isArabic ? "لا توجد منشورات رائجة حاليًا" : "No trending posts yet"}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setNewPostOpen(true)}
              >
                {texts.createPost}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-6">
          {recentLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentPosts.length > 0 ? (
            recentPosts.map(post => (
              <div key={post.id} className="mb-8">
                {renderPostCard(post)}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p>{isArabic ? "لا توجد منشورات حديثة" : "No recent posts"}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setNewPostOpen(true)}
              >
                {texts.createPost}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="following">
          <div className="text-center py-10">
            <p>{isArabic ? "ميزة المتابعة قادمة قريبًا" : "Following feature coming soon"}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="challenges">
          <div className="text-center py-10">
            <p>{isArabic ? "ميزة التحديات قادمة قريبًا" : "Challenges feature coming soon"}</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* نافذة إنشاء منشور جديد */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{texts.createPost}</DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "شارك أفكارك ووصفاتك مع مجتمع الطهي!"
                : "Share your thoughts and recipes with the cooking community!"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">{texts.postTitle}</Label>
              <Input
                id="title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="mt-1"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>
            
            <div>
              <Label htmlFor="content">{texts.postContent}</Label>
              <Textarea
                id="content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={5}
                className="mt-1 resize-none"
                dir={isArabic ? "rtl" : "ltr"}
              />
            </div>
            
            <div>
              <Label htmlFor="tags">{texts.postTags}</Label>
              <Input
                id="tags"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                className="mt-1"
                dir={isArabic ? "rtl" : "ltr"}
                placeholder={isArabic ? "وصفة, طبخ, غداء" : "recipe, cooking, lunch"}
              />
            </div>
            
            <div>
              <Label htmlFor="photo" className="block mb-2">{texts.photoLabel}</Label>
              <Input 
                id="photo" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="mt-1"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  {isArabic ? "تم اختيار:" : "Selected:"} {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setNewPostOpen(false)}
            >
              {texts.cancel}
            </Button>
            <Button 
              onClick={handleCreatePost}
              disabled={createPostMutation.isPending || !postTitle.trim() || !postContent.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? "جاري النشر..." : "Posting..."}
                </>
              ) : (
                texts.post
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}