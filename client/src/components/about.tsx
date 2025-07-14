import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, GraduationCap, Award } from "lucide-react";

export default function About() {
  const achievements = [
    { icon: Trophy, label: "GATE 2025 CS AIR 3207", color: "text-yellow-500" },
    { icon: Trophy, label: "GATE 2025 DA AIR 4032", color: "text-yellow-500" },
    { icon: GraduationCap, label: "BTech AIML - 9.061 CGPA", color: "text-blue-500" },
    { icon: Award, label: "IBM AI Certification", color: "text-green-500" },
  ];

  const skills = [
    { name: "Generative AI", color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" },
    { name: "RAG Systems", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
    { name: "NLP", color: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
    { name: "Deep Learning", color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                I'm a PhD scholar at the Department of Computer Science and Engineering at IIT Kanpur, 
                specializing in Artificial Intelligence and Machine Learning. My research focuses on 
                advancing Natural Language Processing, Generative AI, and Retrieval-Augmented Generation systems.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                With a strong foundation in Python, Deep Learning frameworks, and extensive experience 
                in building AI applications, I'm passionate about creating innovative solutions that 
                bridge the gap between theoretical research and practical applications.
              </p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <Badge key={index} className={skill.color}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Key Achievements</h3>
                <ul className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center">
                      <achievement.icon className={`w-5 h-5 mr-3 ${achievement.color}`} />
                      <span>{achievement.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
