import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Smile, Github, ExternalLink } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Conversational PDF Analysis",
      icon: FileText,
      iconColor: "text-red-500",
      description: "Developed an intelligent system for users to interact with multiple PDFs using conversational queries. Leveraged LLaMA-3.1-70b model via Groq API for robust contextual understanding.",
      technologies: ["LLaMA", "LangChain", "FAISS", "Streamlit"],
      date: "July 2024"
    },
    {
      title: "Phishing URL Detector",
      icon: Shield,
      iconColor: "text-green-500",
      description: "Built a machine learning model to identify malicious URLs using extracted features. Achieved 94% detection accuracy, enhancing cybersecurity measures.",
      technologies: ["Scikit-learn", "Python", "NLP", "Streamlit"],
      date: "November 2023"
    },
    {
      title: "Emotion Classification",
      icon: Smile,
      iconColor: "text-yellow-500",
      description: "Built a deep learning model using CNNs to classify facial expressions as happy or sad. Achieved high accuracy in emotion recognition using advanced computer vision techniques.",
      technologies: ["TensorFlow", "Keras", "CNN", "OpenCV"],
      date: "September 2023"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <project.icon className={`w-6 h-6 ${project.iconColor}`} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{project.date}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
