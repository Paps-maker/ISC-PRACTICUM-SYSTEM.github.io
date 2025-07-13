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
import { BackButton } from "@/components/ui/back-button";

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<"student" | "staff">("staff");
  const [emailOrSchoolId, setEmailOrSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo account quick login
  const handleDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    let demoCredentials;
    
    switch (role) {
      case UserRole.Student:
        demoCredentials = { emailOrSchoolId: "STU2025001", password: "password123" };
        break;
      case UserRole.Instructor:
        demoCredentials = { emailOrSchoolId: "instructor@example.com", password: "password123" };
        break;
      case UserRole.Supervisor:
        demoCredentials = { emailOrSchoolId: "supervisor@example.com", password: "password123" };
        break;
      case UserRole.Admin:
        demoCredentials = { emailOrSchoolId: "admin@system.com", password: "admin123" };
        break;
    }
    
    try {
      await login(demoCredentials.emailOrSchoolId, demoCredentials.password);
      
      toast({
        title: "Login successful",
        description: `You are now logged in as ${role}`,
      });
      
      // Navigate to the correct dashboard path based on role
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
      await login(emailOrSchoolId, password);
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      
      // Wait for user context to update, then redirect based on role
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.role) {
          navigate(`/dashboard/${currentUser.role}`);
        } else {
          navigate("/dashboard/student"); // fallback
        }
      }, 100);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <BackButton to="/" label="Back to Home" className="mb-4" />
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-foreground">Login</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Login Type Toggle */}
            <div className="flex justify-center space-x-2 mb-4">
              <Button
                type="button"
                variant={loginType === "student" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginType("student")}
              >
                Student
              </Button>
              <Button
                type="button"
                variant={loginType === "staff" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginType("staff")}
              >
                Staff
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credential" className="text-foreground">
                    {loginType === "student" ? "School ID" : "Email"}
                  </Label>
                  <Input
                    id="credential"
                    type={loginType === "student" ? "text" : "email"}
                    placeholder={loginType === "student" ? "Enter your school ID" : "name@example.com"}
                    value={emailOrSchoolId}
                    onChange={(e) => setEmailOrSchoolId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <CardFooter className="flex flex-col space-y-4 px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
            
            <div className="w-full border-t pt-4 text-center text-sm text-foreground">
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
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoLogin(UserRole.Admin)}
                  disabled={isSubmitting}
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                  Admin Demo
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
