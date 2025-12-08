import { SimpleEditor } from "@/components/titap/tiptap-templates/simple/simple-editor";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useNewsImageUpload } from "@/hooks/useNewsImageUpload";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import slugify from "slugify";
import throttle from "lodash.throttle";
import { toast } from "sonner";
import { 
  getNewsBySlug, 
  createNews, 
  getNewsImages,
  type CreateNewsRequest 
} from "@/services/newsApi";
import type { NewsDetailResponse } from "@/types/news.types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, User as UserIcon } from "lucide-react";

// Form data interface
interface NewsFormData {
  title: string;
  slug: string;
  description: string;
  thumbnail: File | null;
  isPublic: boolean;
  content: string;
}

// Validation schema
const newsSchema = Yup.object().shape({
  title: Yup.string()
    .required("Tiêu đề không được để trống")
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  slug: Yup.string()
    .required("Slug không được để trống")
    .matches(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  description: Yup.string()
    .required("Mô tả không được để trống")
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(500, "Mô tả không được vượt quá 500 ký tự"),
  thumbnail: Yup.mixed<File>().nullable().default(null),
  isPublic: Yup.boolean().required().default(true),
  content: Yup.string().default(""),
});

export default function NewsUpsertPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading } = useMyProfile();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newsData, setNewsData] = useState<NewsDetailResponse | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [editorContentJson, setEditorContentJson] = useState<object>({});
  const [editorKey, setEditorKey] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!slug;

  // Initialize image upload hook
  const imageUpload = useNewsImageUpload();

  const form = useForm<NewsFormData>({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      thumbnail: null,
      isPublic: true,
      content: "",
    },
  });

  // Load news data when editing
  useEffect(() => {
    const loadNewsData = async () => {
      if (!slug) return;
      
      setIsLoadingNews(true);
      try {
        const response = await getNewsBySlug(slug);
        const news = response.result;
        setNewsData(news);
        
        // Populate form
        form.setValue("title", news.title);
        form.setValue("slug", news.slug);
        form.setValue("description", news.description);
        form.setValue("isPublic", news.isPublic);
        
        // Set thumbnail preview if exists
        if (news.thumbnailUrl) {
          setThumbnailPreview(news.thumbnailUrl);
        }
        
        // Set editor content
        setEditorContent(news.contentHtml || "");
        setEditorKey(prev => prev + 1);
        
        // Load existing images
        try {
          const imagesResponse = await getNewsImages(news.id);
          imageUpload.initializeUploadedImages(imagesResponse.result);
        } catch (error) {
          console.error("Failed to load images:", error);
        }
        
        // Mark slug as manually edited to prevent auto-generation
        setIsSlugManuallyEdited(true);
        
        toast.success("Đã tải dữ liệu tin tức");
      } catch (error) {
        console.error("Failed to load news:", error);
        toast.error("Không thể tải dữ liệu tin tức");
        navigate("/admin/news");
      } finally {
        setIsLoadingNews(false);
      }
    };
    
    loadNewsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Throttled slug generation function
  const generateSlugFromTitle = useCallback(
    (title: string, setValue: (field: string, value: string) => void) => {
      if (title) {
        const generatedSlug = slugify(title, {
          lower: true,
          strict: true,
          locale: "vi",
        });
        setValue("slug", generatedSlug);
      }
    },
    []
  );

  const throttledGenerateSlug = useRef(
    throttle(
      (title: string, setValue: (field: string, value: string) => void) => {
        generateSlugFromTitle(title, setValue);
      },
      500
    )
  ).current;

  // Watch title changes for auto-generating slug
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title && !isSlugManuallyEdited) {
        throttledGenerateSlug(value.title, (field: string, val: string) =>
          form.setValue(field as "slug", val)
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isSlugManuallyEdited, throttledGenerateSlug]);

  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      form.setValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload in editor (creates temp image)
  const handleEditorImageUpload = useCallback(async (file: File): Promise<string> => {
    // Create temporary ObjectURL for immediate preview
    const tempUrl = imageUpload.createTempImage(file);
    return tempUrl;
  }, [imageUpload]);

  // Handle form submission
  const onSubmit = async (data: NewsFormData) => {
    setIsSaving(true);
    
    try {
      // Step 1: Create/Update news to get newsId
      const newsRequest: CreateNewsRequest = {
        id: newsData?.id, // Include ID if editing
        title: data.title,
        slug: data.slug,
        description: data.description,
        thumbnail: thumbnailFile || undefined, // Send File instead of URL
        contentJson: JSON.stringify(editorContentJson),
        contentHtml: editorContent,
        isPublic: data.isPublic,
      };
      
      toast.loading("Đang lưu tin tức...", { id: "save-news" });
      
      const newsResponse = await createNews(newsRequest);
      const savedNews = newsResponse.result;
      
      // Step 2: Process images - upload temp images and replace URLs
      toast.loading("Đang xử lý ảnh...", { id: "save-news" });
      
      const processedHtml = await imageUpload.processSave(
        editorContent,
        savedNews.id
      );
      
      // Step 3: Update news with processed content (if content changed)
      if (processedHtml !== editorContent) {
        const updateRequest: CreateNewsRequest = {
          id: savedNews.id,
          title: data.title,
          slug: data.slug,
          description: data.description,
          contentJson: JSON.stringify(editorContentJson),
          contentHtml: processedHtml,
          isPublic: data.isPublic,
          // Don't send thumbnail again in update
        };
        
        await createNews(updateRequest);
      }
      
      toast.success(
        isEditMode ? "Cập nhật tin tức thành công!" : "Tạo tin tức thành công!",
        { id: "save-news" }
      );
      
      // Navigate to news list
      navigate("/admin/news");
      
    } catch (error) {
      console.error("Failed to save news:", error);
      toast.error("Lỗi khi lưu tin tức", { id: "save-news" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingNews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Thông tin tác giả
                </CardTitle>
                <CardDescription>
                  Người tạo/chỉnh sửa tin tức này
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Không thể tải thông tin người dùng
                  </p>
                )}
              </CardContent>
            </Card>

            {/* News Metadata Form */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin tin tức</CardTitle>
                <CardDescription>
                  Điền thông tin cơ bản cho bài viết của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Input */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tiêu đề <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tiêu đề tin tức..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tiêu đề hấp dẫn sẽ thu hút nhiều người đọc hơn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug Input */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Slug (URL thân thiện){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="duong-dan-url-thuan-tien"
                          {...field}
                          onChange={(e) => {
                            setIsSlugManuallyEdited(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Tự động tạo từ tiêu đề. Bạn có thể chỉnh sửa thủ công.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Thumbnail Upload */}
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={() => (
                      <FormItem>
                        <FormLabel>Ảnh đại diện</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                ref={fileInputRef}
                                className="cursor-pointer"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            </div>
                            {thumbnailPreview && (
                              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                <img
                                  src={thumbnailPreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Tải lên ảnh đại diện cho tin tức (khuyến nghị:
                          1200x630px)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Public Toggle */}
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between">
                        <div>
                          <FormLabel>Trạng thái xuất bản</FormLabel>
                          <FormDescription>
                            Bật để công khai tin tức cho mọi người xem
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-3 pt-2">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span className="text-sm font-medium">
                              {field.value ? "Công khai" : "Nháp"}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Textarea */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mô tả ngắn <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả ngắn gọn về nội dung tin tức..."
                          className="min-h-[100px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả này sẽ hiển thị trong kết quả tìm kiếm và chia sẻ
                        mạng xã hội
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Editor Section */}
            <Card>
              <CardHeader>
                <CardTitle>Nội dung chi tiết</CardTitle>
                <CardDescription>
                  Viết nội dung chi tiết cho tin tức của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleEditor 
                  key={editorKey} 
                  initialContent={editorContent}
                  onChange={(html, json) => {
                    setEditorContent(html);
                    if (json) {
                      setEditorContentJson(json);
                    }
                    form.setValue("content", html);
                  }}
                  onImageUpload={handleEditorImageUpload}
                />
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pb-8">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/admin/news")}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                variant="default"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  isEditMode ? "Cập nhật tin tức" : "Tạo tin tức"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
