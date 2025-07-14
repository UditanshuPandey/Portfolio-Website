import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBlogSchema, type Blog } from "@shared/schema";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

const blogFormSchema = insertBlogSchema.extend({
  tags: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

export default function AdminPanel() {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log("Not authenticated");
      }
    };
    checkAuth();
  }, []);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["/api/admin/blogs"],
    enabled: !!user,
  });

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      publishedAt: new Date(),
      readTime: 5,
      featured: false,
      isDraft: false,
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return apiRequest("/api/admin/blogs", "POST", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      toast({ title: "Blog created successfully!" });
      setShowForm(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error creating blog", description: error.message, variant: "destructive" });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      };
      return apiRequest(`/api/admin/blogs/${editingBlog?.id}`, "PUT", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      toast({ title: "Blog updated successfully!" });
      setEditingBlog(null);
      setShowForm(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error updating blog", description: error.message, variant: "destructive" });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/blogs/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      toast({ title: "Blog deleted successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error deleting blog", description: error.message, variant: "destructive" });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast({ title: "Login successful!" });
      } else {
        const error = await response.json();
        toast({ title: "Login failed", description: error.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Login error", description: "Please try again", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast({ title: "Logged out successfully!" });
    } catch (error) {
      toast({ title: "Logout error", variant: "destructive" });
    }
  };

  const onSubmit = (data: BlogFormData) => {
    if (editingBlog) {
      updateBlogMutation.mutate(data);
    } else {
      createBlogMutation.mutate(data);
    }
  };

  const startEditing = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
    form.reset({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags?.join(", ") || "",
      publishedAt: blog.publishedAt,
      readTime: blog.readTime,
      featured: blog.featured || false,
      isDraft: blog.isDraft || false,
    });
  };

  const cancelEditing = () => {
    setEditingBlog(null);
    setShowForm(false);
    form.reset();
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!editingBlog) {
      form.setValue("slug", generateSlug(title));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please login to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user.username}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Blog Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Blog Management</CardTitle>
                  <CardDescription>Create, edit, and manage blog posts</CardDescription>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={showForm}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Blog</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showForm && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            {...form.register("title")}
                            onChange={handleTitleChange}
                          />
                          {form.formState.errors.title && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.title.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug</Label>
                          <Input id="slug" {...form.register("slug")} />
                          {form.formState.errors.slug && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.slug.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          {...form.register("excerpt")}
                          rows={3}
                        />
                        {form.formState.errors.excerpt && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.excerpt.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          {...form.register("content")}
                          rows={10}
                        />
                        {form.formState.errors.content && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.content.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" {...form.register("category")} />
                          {form.formState.errors.category && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.category.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input id="tags" {...form.register("tags")} />
                        </div>
                        <div>
                          <Label htmlFor="readTime">Read Time (minutes)</Label>
                          <Input
                            id="readTime"
                            type="number"
                            {...form.register("readTime", { valueAsNumber: true })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={form.watch("featured")}
                            onCheckedChange={(checked) => form.setValue("featured", checked)}
                          />
                          <Label htmlFor="featured">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isDraft"
                            checked={form.watch("isDraft")}
                            onCheckedChange={(checked) => form.setValue("isDraft", checked)}
                          />
                          <Label htmlFor="isDraft">Draft</Label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingBlog ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="text-center py-8">Loading blogs...</div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog: Blog) => (
                    <Card key={blog.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{blog.title}</h3>
                            {blog.isDraft && (
                              <Badge variant="secondary">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Draft
                              </Badge>
                            )}
                            {blog.featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {blog.category}</span>
                            <span>Read Time: {blog.readTime}min</span>
                            <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
                          </div>
                          {blog.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {blog.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(blog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBlogMutation.mutate(blog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}