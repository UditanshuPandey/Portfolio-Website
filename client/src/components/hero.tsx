import { Button } from "@/components/ui/button";
import { User, Mail, ExternalLink } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fadeInUp">
          {/* Professional headshot placeholder */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-16 h-16 text-white/80" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Uditanshu Pandey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            PhD Scholar at IIT Kanpur
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              GATE 2025 CS AIR 3207
            </span>
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              GATE 2025 DA AIR 4032
            </span>
          </div>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Passionate about Python, Machine Learning, NLP, Generative AI & RAG systems. 
            Building innovative AI solutions and contributing to cutting-edge research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
            >
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("projects")}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
