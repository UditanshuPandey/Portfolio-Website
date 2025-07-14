import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar } from "lucide-react";

export default function Education() {
  const education = [
    {
      degree: "PhD in Computer Science",
      institution: "Indian Institute of Technology (IIT) Kanpur",
      period: "Present",
      description: "Current PhD Scholar specializing in AI/ML, NLP, and Generative AI",
      gradient: "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
    },
    {
      degree: "BTech in Artificial Intelligence & Machine Learning",
      institution: "Delhi Technical Campus - GGSIPU",
      period: "2021 - 2025",
      description: "CGPA: 9.061/10.0",
      gradient: "from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
    },
    {
      degree: "12th Grade (PCM with Computer Science)",
      institution: "Amity International School (CBSE)",
      period: "2019 - 2021",
      description: "Percentage: 95.2%",
      gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    }
  ];

  const certifications = [
    {
      title: "Data Analysis with Python",
      description: "Professional certification in data analysis techniques"
    },
    {
      title: "IBM SkillsBuild AI Program",
      description: "Comprehensive training in artificial intelligence applications"
    },
    {
      title: "NIELIT Summer Training",
      description: "Web development specialization with Django framework"
    },
    {
      title: "IIRS AI/ML for Geodata",
      description: "Specialized training in geospatial data analysis"
    }
  ];

  return (
    <section id="education" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Education</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card key={index} className={`bg-gradient-to-r ${edu.gradient}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <GraduationCap className="w-6 h-6 mr-2" />
                        {edu.degree}
                      </h3>
                      <p className="text-lg text-primary font-medium mb-2">{edu.institution}</p>
                      <p className="text-gray-700 dark:text-gray-300">{edu.description}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4 md:mt-0">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.period}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Certifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="bg-gray-50 dark:bg-gray-700">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-2">{cert.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
