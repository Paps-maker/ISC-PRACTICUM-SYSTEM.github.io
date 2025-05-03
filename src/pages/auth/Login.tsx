
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo account quick login
  const handleDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    let demoEmail;
    
    switch (role) {
      case UserRole.Student:
        demoEmail = "student@example.com";
        break;
      case UserRole.Instructor:
        demoEmail = "instructor@example.com";
        break;
      case UserRole.Supervisor:
        demoEmail = "supervisor@example.com";
        break;
    }
    
    try {
      await login(demoEmail, "password123");
      
      toast({
        title: "Login successful",
        description: `You are now logged in as ${role}`,
      });
      
      // Redirect to the appropriate dashboard
      navigate(`/dashboard/${role}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      
      // Auth context will determine the proper redirect
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
            
            <div className="w-full border-t pt-4 text-center text-sm text-muted-foreground">
              <div className="mb-2">Try a demo account:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(UserRole.Student)}
                  disabled={isSubmitting}
                >
                  Student Demo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(UserRole.Instructor)}
                  disabled={isSubmitting}
                >
                  Instructor Demo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(UserRole.Supervisor)}
                  disabled={isSubmitting}
                >
                  Supervisor Demo
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
