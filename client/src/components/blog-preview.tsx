import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Blog } from "@shared/schema";

interface BlogPreviewProps {
  blog: Blog;
}

export function BlogPreview({ blog }: BlogPreviewProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="mb-2">
            {blog.category}
          </Badge>
          {blog.featured && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Featured
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
          <Link href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(blog.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {blog.readTime} min read
            </div>
          </div>
          
          <Button variant="default" size="sm" asChild>
            <Link href={`/blog/${blog.slug}`} className="flex items-center gap-1">
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}