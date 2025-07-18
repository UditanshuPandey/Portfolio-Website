import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertBlogSchema, loginSchema } from "@shared/schema";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required")
});

// Simple authentication middleware
const requireAuth = async (req: any, res: any, next: any) => {
  const sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const session = await storage.getSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }
  
  const user = await storage.getUser(session.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  
  req.user = user;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const session = await storage.createSession(user.id);
      res.cookie("sessionId", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
      }
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req: any, res) => {
    try {
      const sessionId = req.cookies?.sessionId;
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.clearCookie("sessionId");
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/auth/user", requireAuth, async (req: any, res) => {
    res.json({ id: req.user.id, username: req.user.username });
  });
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      
      // Log the contact form submission
      console.log("Contact form submission:", {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        timestamp: new Date().toISOString()
      });
      
      // In a real application, you would:
      // 1. Send an email notification
      // 2. Store the message in a database
      // 3. Send an auto-reply to the sender
      
      res.status(200).json({ 
        message: "Message sent successfully",
        success: true 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid form data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Blog endpoints (public)
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      
      const blog = await storage.getBlog(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/blogs/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const blog = await storage.getBlogBySlug(slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin blog endpoints (protected)
  app.get("/api/admin/blogs", requireAuth, async (req, res) => {
    try {
      const blogs = await storage.getBlogs(true);
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/blogs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(validatedData);
      res.status(201).json(blog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid blog data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.put("/api/admin/blogs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      
      const validatedData = insertBlogSchema.partial().parse(req.body);
      const blog = await storage.updateBlog(id, validatedData);
      
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid blog data",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/admin/blogs/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }
      
      const deleted = await storage.deleteBlog(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
