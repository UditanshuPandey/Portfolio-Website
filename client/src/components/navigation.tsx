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

    // Check authentication status
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
        // If not on home page, navigate to home first, then scroll
        window.location.href = `/${item.href}`;
      } else {
        scrollToSection(item.href);
      }
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">
            Uditanshu Pandey
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              item.type === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className={`transition-colors ${
                    activeSection === item.href.slice(1)
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Admin Button (only shown when authenticated) */}
            {isAuthenticated && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden md:flex"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500" />
              )}
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    item.type === "link" ? (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-left py-2 transition-colors ${
                          location === item.href
                            ? "text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item)}
                        className={`text-left py-2 transition-colors ${
                          activeSection === item.href.slice(1)
                            ? "text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                  
                  {/* Admin Link for Mobile */}
                  {isAuthenticated && (
                    <Link
                      href="/admin"
                      className="text-left py-2 transition-colors text-gray-700 dark:text-gray-300 hover:text-primary flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
