import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Share, Award, PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// بيانات نموذجية للمنشورات
const SAMPLE_POSTS = [
  {
    id: 1,
    user: {
      name: "سارة أحمد",
      level: "طاهي متقدم",
      avatar: "https://i.pravatar.cc/150?img=23",
      initials: "سأ"
    },
    title: "طريقة عمل كيكة الشوكولاتة بالصوص السائل",
    content: "اليوم شاركت في تحدي الحلويات وأحببت أن أشارككم وصفتي المفضلة لكيكة الشوكولاتة بالصوص السائل...",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    tags: ["حلويات", "شوكولاتة", "تحدي الأسبوع"],
    likes: 42,
    comments: 7,
    shares: 3,
    date: "منذ 3 ساعات"
  },
  {
    id: 2,
    user: {
      name: "محمد علي",
      level: "طاهي محترف",
      avatar: "https://i.pravatar.cc/150?img=12",
      initials: "مع"
    },
    title: "وجبة إيطالية خفيفة: سباغيتي بصوص البيستو محلي الصنع",
    content: "اليوم أشارككم وصفتي لسباغيتي البيستو بمكونات بسيطة متوفرة في كل مطبخ. الوصفة سهلة وسريعة...",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["مكرونة", "إيطالي", "نباتي"],
    likes: 36,
    comments: 12,
    shares: 5,
    date: "منذ يومين"
  },
  {
    id: 3,
    user: {
      name: "نورا محمود",
      level: "هاوي طبخ",
      avatar: "https://i.pravatar.cc/150?img=29",
      initials: "نم"
    },
    title: "أول تجربة مع خبز التنور - شاركوني رأيكم!",
    content: "بعد عدة محاولات أخيرًا نجحت في صنع خبز التنور في المنزل. استخدمت دقيق القمح الكامل واتبعت خطوات ووقت التخمير بدقة...",
    image: "https://images.unsplash.com/photo-1586765501019-cbe3294228fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["خبز", "مخبوزات", "تجارب"],
    likes: 28,
    comments: 15,
    shares: 2,
    date: "منذ 4 أيام"
  }
];

// بيانات نموذجية للمنشورات باللغة الإنجليزية
const SAMPLE_POSTS_EN = [
  {
    id: 1,
    user: {
      name: "Sarah Ahmed",
      level: "Advanced Chef",
      avatar: "https://i.pravatar.cc/150?img=23",
      initials: "SA"
    },
    title: "How to Make Chocolate Lava Cake",
    content: "Today I participated in the dessert challenge and wanted to share my favorite recipe for chocolate lava cake...",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    tags: ["Desserts", "Chocolate", "Weekly Challenge"],
    likes: 42,
    comments: 7,
    shares: 3,
    date: "3 hours ago"
  },
  {
    id: 2,
    user: {
      name: "Mohammed Ali",
      level: "Professional Chef",
      avatar: "https://i.pravatar.cc/150?img=12",
      initials: "MA"
    },
    title: "Light Italian Meal: Spaghetti with Homemade Pesto",
    content: "Today I'm sharing my recipe for pesto spaghetti with simple ingredients available in every kitchen. The recipe is easy and quick...",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Pasta", "Italian", "Vegetarian"],
    likes: 36,
    comments: 12,
    shares: 5,
    date: "2 days ago"
  },
  {
    id: 3,
    user: {
      name: "Nora Mahmoud",
      level: "Cooking Enthusiast",
      avatar: "https://i.pravatar.cc/150?img=29",
      initials: "NM"
    },
    title: "First Attempt at Tandoor Bread - Share Your Thoughts!",
    content: "After several attempts, I finally succeeded in making tandoor bread at home. I used whole wheat flour and followed the fermentation steps and timing precisely...",
    image: "https://images.unsplash.com/photo-1586765501019-cbe3294228fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Bread", "Baking", "Experiments"],
    likes: 28,
    comments: 15,
    shares: 2,
    date: "4 days ago"
  }
];

export default function CommunityPostsPage() {
  const { language } = useLanguage();
  const isArabic = language.startsWith('ar');
  const posts = isArabic ? SAMPLE_POSTS : SAMPLE_POSTS_EN;
  
  // للتبديل بين تبويبات المحتوى
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // النصوص المترجمة
  const texts = {
    title: isArabic ? "منشورات مجتمع الطهاة" : "Chef Community Posts",
    trending: isArabic ? "الرائج" : "Trending",
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
    photoLabel: isArabic ? "إضافة صورة" : "Add Photo"
  };
  
  // وظيفة لمعالجة إنشاء منشور جديد
  const handleCreatePost = () => {
    console.log("Creating new post:", { postTitle, postContent, postTags, selectedFile });
    // هنا ستقوم بإرسال البيانات إلى الخادم
    
    // إعادة تعيين النموذج
    setPostTitle("");
    setPostContent("");
    setPostTags("");
    setSelectedFile(null);
    setNewPostOpen(false);
  };
  
  // وظيفة لمعالجة تحميل الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{texts.title}</h1>
        <Button 
          onClick={() => setNewPostOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {texts.createPost}
        </Button>
      </div>
      
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="trending">{texts.trending}</TabsTrigger>
          <TabsTrigger value="recent">{texts.recent}</TabsTrigger>
          <TabsTrigger value="following">{texts.following}</TabsTrigger>
          <TabsTrigger value="challenges">{texts.challenges}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="flex items-center text-lg">
                    {post.user.name}
                    <Award className="h-4 w-4 text-amber-500 ml-2" />
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <span>{post.user.level}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-2">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="mb-4">{post.content}</p>
                {post.image && (
                  <div className="rounded-md overflow-hidden mb-4 max-h-[400px] w-full">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-zinc-100">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t px-6 py-3 bg-muted/20">
                <div className="flex gap-6 w-full">
                  <Button variant="ghost" size="sm" className="flex items-center text-zinc-600">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{post.likes}</span>
                    <span className="hidden sm:inline ml-1">{texts.like}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center text-zinc-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>{post.comments}</span>
                    <span className="hidden sm:inline ml-1">{texts.comment}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center text-zinc-600">
                    <Share className="h-4 w-4 mr-1" />
                    <span>{post.shares}</span>
                    <span className="hidden sm:inline ml-1">{texts.share}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="text-center py-12">
            {isArabic 
              ? "سيتم عرض أحدث المنشورات هنا"
              : "Latest posts will be displayed here"}
          </div>
        </TabsContent>
        
        <TabsContent value="following">
          <div className="text-center py-12">
            {isArabic 
              ? "ستظهر منشورات الطهاة الذين تتابعهم هنا"
              : "Posts from chefs you follow will appear here"}
          </div>
        </TabsContent>
        
        <TabsContent value="challenges">
          <div className="text-center py-12">
            {isArabic 
              ? "ستظهر منشورات تحديات الطبخ الأسبوعية هنا"
              : "Weekly cooking challenge posts will appear here"}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* نافذة حوار إنشاء منشور جديد */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{texts.createPost}</DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "شارك وصفاتك المفضلة أو تجاربك في الطبخ مع مجتمع الطهاة"
                : "Share your favorite recipes or cooking experiments with the chef community"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">{texts.postTitle}</Label>
              <Input 
                id="post-title" 
                value={postTitle} 
                onChange={(e) => setPostTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-content">{texts.postContent}</Label>
              <Textarea 
                id="post-content" 
                rows={5} 
                value={postContent} 
                onChange={(e) => setPostContent(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-tags">{texts.postTags}</Label>
              <Input 
                id="post-tags" 
                placeholder={isArabic ? "حلويات، وصفات سريعة..." : "desserts, quick recipes..."}
                value={postTags} 
                onChange={(e) => setPostTags(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-photo">{texts.photoLabel}</Label>
              <Input 
                id="post-photo" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="cursor-pointer"
              />
              {selectedFile && (
                <div className="text-sm text-green-600">
                  {isArabic ? "تم اختيار: " : "Selected: "} 
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)}>
              {texts.cancel}
            </Button>
            <Button 
              onClick={handleCreatePost} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {texts.post}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}