import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Menu, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { href: "#home", label: "Home", type: "scroll" },
  { href: "#about", label: "About", type: "scroll" },
  { href: "#experience", label: "Experience", type: "scroll" },
  { href: "#projects", label: "Projects", type: "scroll" },
  { href: "#skills", label: "Skills", type: "scroll" },
  { href: "#education", label: "Education", type: "scroll" },
  { href: "/blog", label: "Blog", type: "link" },
  { href: "#contact", label: "Contact", type: "scroll" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          setActiveSection(section.getAttribute("id") || "");
        }
      });
    };

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.type === "scroll") {
      if (location !== "/") {
        window.location.href = `/${item.href}`;
      } else {
        scrollToSection(item.href);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            Uditanshu Pandey
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200 ${
                  activeSection === item.href.substring(1) ? "underline" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle */}
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-4 text-gray-800 dark:text-gray-200"
            variant="ghost"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
