import { users, sessions, type User, type InsertUser, type Blog, type InsertBlog, type Session } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getBlogs(includePrivate?: boolean): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, blog: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
  createSession(userId: number): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<number, Blog>;
  private sessions: Map<string, Session>;
  private currentUserId: number;
  private currentBlogId: number;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentBlogId = 1;
    
    // Create default admin user
    this.seedUsers();
    // Add some sample blog posts
    this.seedBlogs();
  }

  private seedUsers() {
    // Create admin user (password should be hashed in production)
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123" // In production, this should be a hashed password
    };
    this.users.set(adminUser.id, adminUser);
  }

  private seedBlogs() {
    const sampleBlogs: InsertBlog[] = [
      {
        title: "Understanding Retrieval-Augmented Generation (RAG)",
        slug: "understanding-rag",
        content: "Retrieval-Augmented Generation (RAG) is a revolutionary approach that combines the power of large language models with external knowledge retrieval. This technique allows AI systems to access and incorporate real-time information from various sources, making responses more accurate and up-to-date...",
        excerpt: "Exploring how RAG systems enhance AI responses by combining language models with external knowledge retrieval for more accurate and contextual outputs.",
        category: "AI/ML",
        tags: ["RAG", "NLP", "AI", "Machine Learning"],
        publishedAt: new Date("2024-01-15"),
        readTime: 8,
        featured: true,
        isDraft: false,
      },
      {
        title: "My Journey Through GATE 2025: Tips and Strategies",
        slug: "gate-2025-journey",
        content: "Preparing for GATE 2025 was one of the most challenging yet rewarding experiences of my academic journey. Achieving AIR 3207 in Computer Science and AIR 4032 in Data Science & AI required dedicated preparation, strategic planning, and consistent effort...",
        excerpt: "A detailed account of my GATE 2025 preparation journey, sharing strategies and tips that helped me achieve top ranks in both CS and DA papers.",
        category: "Academic",
        tags: ["GATE", "Computer Science", "Data Science", "Study Tips"],
        publishedAt: new Date("2024-02-20"),
        readTime: 12,
        featured: true,
        isDraft: false,
      },
      {
        title: "Building Conversational AI with LLaMA and LangChain",
        slug: "conversational-ai-llama-langchain",
        content: "In this technical deep dive, I'll walk you through the process of building a conversational AI system using LLaMA-3.1-70b and LangChain. This project demonstrates how to create intelligent document interaction systems that can understand and respond to user queries...",
        excerpt: "A technical guide to building conversational AI systems using LLaMA and LangChain for intelligent document processing and query handling.",
        category: "Technical",
        tags: ["LLaMA", "LangChain", "AI", "NLP", "Python"],
        publishedAt: new Date("2024-03-10"),
        readTime: 15,
        featured: false,
        isDraft: false,
      },
    ];

    sampleBlogs.forEach(blog => {
      const id = this.currentBlogId++;
      const blogWithId: Blog = { 
        ...blog, 
        id,
        tags: blog.tags || null,
        featured: blog.featured || null
      };
      this.blogs.set(id, blogWithId);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogs(includePrivate: boolean = false): Promise<Blog[]> {
    return Array.from(this.blogs.values())
      .filter(blog => includePrivate || !blog.isDraft)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    return Array.from(this.blogs.values()).find(blog => blog.slug === slug);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentBlogId++;
    const blog: Blog = { 
      ...insertBlog, 
      id,
      tags: insertBlog.tags || null,
      featured: insertBlog.featured || null
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updateData: Partial<InsertBlog>): Promise<Blog | undefined> {
    const existingBlog = this.blogs.get(id);
    if (!existingBlog) return undefined;

    const updatedBlog: Blog = { 
      ...existingBlog, 
      ...updateData,
      tags: updateData.tags || existingBlog.tags,
      featured: updateData.featured !== undefined ? updateData.featured : existingBlog.featured
    };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  async createSession(userId: number): Promise<Session> {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const session: Session = {
      id,
      userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    // Check if session is expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    
    return session;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }
}

export const storage = new MemStorage();
