
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const getDashboardLink = () => {
    if (!user) return "/login";
    
    switch (user.role) {
      case UserRole.Student:
        return "/dashboard/student";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      default:
        return "/login";
    }
  };

  const roleFeatures = [
    {
      role: "Students",
      features: [
        "Register and log in to the system",
        "View assigned practicum activities",
        "Upload reports in PDF or DOCX format",
        "Track feedback and grades on submissions"
      ]
    },
    {
      role: "Instructors",
      features: [
        "Create and schedule practicum activities",
        "Set deadlines and provide instructions",
        "View student submission status",
        "Manage coursework requirements"
      ]
    },
    {
      role: "Supervisors",
      features: [
        "View list of registered students",
        "Download and review submitted reports",
        "Provide grades and feedback",
        "Track student progress"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      {/* University Image Banner */}
      <div className="w-full max-h-96 overflow-hidden relative">
        <img 
          src="/lovable-uploads/04f2854b-59c7-4491-aac7-92d59c799908.png" 
          alt="University of Eastern Africa, Baraton" 
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              ISC Student Practicum Management System
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              University of Eastern Africa, Baraton
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprehensive Practicum Management
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A platform for managing, submitting, and evaluating student practicums
          </p>
          <div className="flex justify-center gap-4 mt-6">
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button size="lg" className="px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="px-8">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="px-8">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {roleFeatures.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  For {item.role}
                </h3>
                <ul className="space-y-2">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your practicum?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our platform to simplify your practicum management experience
          </p>
          {isAuthenticated ? (
            <Link to={getDashboardLink()}>
              <Button size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
