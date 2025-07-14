import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      title: "IBM SkillsBuild Internship",
      company: "Artificial Intelligence",
      period: "July 2024 - August 2024",
      description: "Participated in an intensive AI program including masterclasses and hands-on learning. Designed and fine-tuned chatbots using IBM Watson Assistant with practical applications.",
      skills: ["IBM Watson", "Chatbot Development", "AI Training"],
      color: "bg-blue-500"
    },
    {
      title: "Web Development Specialist",
      company: "NIELIT",
      period: "September 2023 - October 2023",
      description: "Completed comprehensive web development training focused on Django framework. Developed a fully functional web application and received positive feedback for technical proficiency.",
      skills: ["Django", "Python", "Web Development"],
      color: "bg-green-500"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary"></div>
            
            {experiences.map((exp, index) => (
              <div key={index} className="relative mb-12 ml-16">
                <div className={`absolute -left-20 top-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 ${exp.color}`}></div>
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.period}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
