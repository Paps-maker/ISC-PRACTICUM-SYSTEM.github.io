
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, List } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Student Practicum Management
        </h1>
        <p className="text-xl text-muted-foreground">
          Track and manage student practicum activities, submissions, and evaluations in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/login">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/students">
            <Button variant="outline" size="lg">
              <List className="mr-2 h-5 w-5" />
              View Registered Students
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
