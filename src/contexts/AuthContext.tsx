
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, AuthContextType } from "../types";
import { studentStore } from "@/stores/studentStore";

// Mock user data (would use an actual API in production)
const mockUsers = [
  {
    id: "1",
    name: "John Student",
    email: "student@example.com",
    password: "password123",
    role: UserRole.Student,
    schoolId: "STU2025001"
  },
  {
    id: "2",
    name: "Jane Instructor",
    email: "instructor@example.com",
    password: "password123",
    role: UserRole.Instructor
  },
  {
    id: "3",
    name: "Bob Supervisor",
    email: "supervisor@example.com",
    password: "password123",
    role: UserRole.Supervisor
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for saved user in localStorage (in a real app, would validate the token)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Remove password from the user object
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole, schoolId?: string) => {
    setLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        if (mockUsers.some(u => u.email === email)) {
          setLoading(false);
          reject(new Error("User with this email already exists"));
          return;
        }
        
        // Create new user
        const newUser = {
          id: `${mockUsers.length + 1}`,
          name,
          email,
          password,
          role,
          ...(schoolId && { schoolId })
        };
        
        mockUsers.push(newUser);
        
        // Login the user after registration
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        
        // If the user is a student, add them to the student store
        if (role === UserRole.Student) {
          studentStore.addStudent(userWithoutPassword);
        }
        
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Navigation will be handled by the component that calls logout
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
