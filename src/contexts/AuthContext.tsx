
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, AuthContextType } from "@/types";
import { studentStore } from "@/stores/studentStore";

// Initial mock user data - these will be combined with registered users
const initialMockUsers = [
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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Load registered users from localStorage and combine with initial mock users
    const savedRegisteredUsers = localStorage.getItem("registeredUsers");
    const registeredUsers = savedRegisteredUsers ? JSON.parse(savedRegisteredUsers) : [];
    
    // Combine initial mock users with registered users, avoiding duplicates
    const combinedUsers = [...initialMockUsers];
    registeredUsers.forEach((regUser: any) => {
      const exists = combinedUsers.some(u => u.email === regUser.email || u.schoolId === regUser.schoolId);
      if (!exists) {
        combinedUsers.push(regUser);
      }
    });
    
    setAllUsers(combinedUsers);
    
    // Check for saved user in localStorage (in a real app, would validate the token)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrSchoolId: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if it's an email (contains @) or school ID
        const isEmail = emailOrSchoolId.includes('@');
        
        let foundUser;
        if (isEmail) {
          // Login with email for instructors and supervisors
          foundUser = allUsers.find(u => u.email === emailOrSchoolId && u.password === password);
        } else {
          // Login with school ID for students
          foundUser = allUsers.find(u => u.schoolId === emailOrSchoolId && u.password === password && u.role === UserRole.Student);
        }
        
        if (foundUser) {
          // Remove password from the user object
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error("Invalid credentials"));
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
        if (allUsers.some(u => u.email === email)) {
          setLoading(false);
          reject(new Error("User with this email already exists"));
          return;
        }
        
        if (role === UserRole.Student && schoolId && allUsers.some(u => u.schoolId === schoolId)) {
          setLoading(false);
          reject(new Error("User with this school ID already exists"));
          return;
        }
        
        // Create new user
        const newUser = {
          id: `${allUsers.length + 1}`,
          name,
          email,
          password,
          role,
          ...(schoolId && { schoolId })
        };
        
        // Add to allUsers state
        const updatedUsers = [...allUsers, newUser];
        setAllUsers(updatedUsers);
        
        // Save registered users to localStorage (excluding initial mock users)
        const savedRegisteredUsers = localStorage.getItem("registeredUsers");
        const registeredUsers = savedRegisteredUsers ? JSON.parse(savedRegisteredUsers) : [];
        registeredUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        
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
