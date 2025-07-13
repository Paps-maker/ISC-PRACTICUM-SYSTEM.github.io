
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, AuthContextType } from "@/types";
import { studentStore } from "@/stores/studentStore";

// Default admin account - this will always exist
const ADMIN_ACCOUNT = {
  id: "admin-001",
  name: "System Administrator",
  email: "admin@system.com",
  password: "admin123",
  role: UserRole.Admin
};

// Initial mock users for demo purposes
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
  
  // Initialize localStorage with default users if not present
  const initializeUserData = () => {
    const existingUsers = localStorage.getItem("allSystemUsers");
    if (!existingUsers) {
      const defaultUsers = [ADMIN_ACCOUNT, ...initialMockUsers];
      localStorage.setItem("allSystemUsers", JSON.stringify(defaultUsers));
      return defaultUsers;
    } else {
      const users = JSON.parse(existingUsers);
      // Ensure admin account always exists
      const hasAdmin = users.some((u: any) => u.role === UserRole.Admin);
      if (!hasAdmin) {
        users.unshift(ADMIN_ACCOUNT);
        localStorage.setItem("allSystemUsers", JSON.stringify(users));
      }
      return users;
    }
  };

  useEffect(() => {
    // Initialize user data in localStorage
    const users = initializeUserData();
    setAllUsers(users);
    
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrSchoolId: string, password: string) => {
    setLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Get current users from localStorage
        const currentUsers = JSON.parse(localStorage.getItem("allSystemUsers") || "[]");
        
        // Check if it's an email (contains @) or school ID
        const isEmail = emailOrSchoolId.includes('@');
        
        let foundUser;
        if (isEmail) {
          // Login with email for all roles except students with school ID
          foundUser = currentUsers.find((u: any) => u.email === emailOrSchoolId && u.password === password);
        } else {
          // Login with school ID for students
          foundUser = currentUsers.find((u: any) => u.schoolId === emailOrSchoolId && u.password === password && u.role === UserRole.Student);
        }
        
        if (foundUser) {
          // Remove password from the user object
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
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
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Get current users from localStorage
        const currentUsers = JSON.parse(localStorage.getItem("allSystemUsers") || "[]");
        
        // Check if user already exists
        if (currentUsers.some((u: any) => u.email === email)) {
          setLoading(false);
          reject(new Error("User with this email already exists"));
          return;
        }
        
        if (role === UserRole.Student && schoolId && currentUsers.some((u: any) => u.schoolId === schoolId)) {
          setLoading(false);
          reject(new Error("User with this school ID already exists"));
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          password,
          role,
          ...(schoolId && { schoolId }),
          registrationDate: new Date().toISOString().split('T')[0]
        };
        
        // Add to users array and save to localStorage
        const updatedUsers = [...currentUsers, newUser];
        localStorage.setItem("allSystemUsers", JSON.stringify(updatedUsers));
        setAllUsers(updatedUsers);
        
        // Login the user after registration
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        
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
    localStorage.removeItem("currentUser");
  };

  // Admin functions
  const getAllUsers = () => {
    const users = JSON.parse(localStorage.getItem("allSystemUsers") || "[]");
    return users.map(({ password, ...user }: any) => user); // Remove passwords from returned data
  };

  const deleteUser = (userId: string) => {
    if (userId === ADMIN_ACCOUNT.id) {
      throw new Error("Cannot delete admin account");
    }
    
    const currentUsers = JSON.parse(localStorage.getItem("allSystemUsers") || "[]");
    const updatedUsers = currentUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem("allSystemUsers", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const currentUsers = JSON.parse(localStorage.getItem("allSystemUsers") || "[]");
    const updatedUsers = currentUsers.map((u: any) => 
      u.id === userId ? { ...u, ...updates } : u
    );
    localStorage.setItem("allSystemUsers", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  const clearAllUserData = () => {
    // Reset to default users (admin + initial mock users)
    const defaultUsers = [ADMIN_ACCOUNT, ...initialMockUsers];
    localStorage.setItem("allSystemUsers", JSON.stringify(defaultUsers));
    setAllUsers(defaultUsers);
    
    // Clear other related data
    localStorage.removeItem("registeredUsers");
    localStorage.removeItem("registeredStudents");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    // Admin functions
    getAllUsers: user?.role === UserRole.Admin ? getAllUsers : undefined,
    deleteUser: user?.role === UserRole.Admin ? deleteUser : undefined,
    updateUser: user?.role === UserRole.Admin ? updateUser : undefined,
    clearAllUserData: user?.role === UserRole.Admin ? clearAllUserData : undefined,
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
