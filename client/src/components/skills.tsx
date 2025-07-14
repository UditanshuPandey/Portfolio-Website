import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code, Layers, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("skills");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      iconColor: "text-blue-500",
      skills: [
        { name: "Python", level: 90, label: "Advanced" },
        { name: "C++", level: 75, label: "Intermediate" },
        { name: "SQL", level: 70, label: "Intermediate" },
      ]
    },
    {
      title: "Frameworks & Libraries",
      icon: Layers,
      iconColor: "text-green-500",
      skills: [
        { name: "TensorFlow", level: 85, label: "Advanced" },
        { name: "Scikit-learn", level: 80, label: "Advanced" },
        { name: "Django", level: 75, label: "Intermediate" },
      ]
    },
    {
      title: "Tools & Technologies",
      icon: Settings,
      iconColor: "text-purple-500",
      skills: [
        { name: "LangChain", level: 85, label: "Advanced" },
        { name: "FAISS", level: 75, label: "Intermediate" },
        { name: "Streamlit", level: 80, label: "Advanced" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Technical Skills</h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <category.icon className={`w-5 h-5 mr-3 ${category.iconColor}`} />
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{skill.label}</span>
                        </div>
                        <Progress 
                          value={isVisible ? skill.level : 0} 
                          className="h-2 transition-all duration-1000 ease-in-out"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
