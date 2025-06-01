
import { User, UserRole } from "@/types";

// Initial mock students - these will be the default students in the system
const initialStudents: User[] = [
  { 
    id: "1", 
    name: "John Student", 
    email: "student@example.com", 
    role: UserRole.Student,
    registrationDate: "2025-01-15"
  },
  { 
    id: "4", 
    name: "Alice Cooper", 
    email: "alice@example.com", 
    role: UserRole.Student,
    registrationDate: "2025-02-10"
  },
  { 
    id: "5", 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    role: UserRole.Student,
    registrationDate: "2025-02-15"
  },
  { 
    id: "6", 
    name: "Carol White", 
    email: "carol@example.com", 
    role: UserRole.Student,
    registrationDate: "2025-03-01"
  },
  { 
    id: "7", 
    name: "Dave Brown", 
    email: "dave@example.com", 
    role: UserRole.Student,
    registrationDate: "2025-03-10"
  },
];

// Student store that manages the list of registered students
class StudentStore {
  private students: User[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Load students from localStorage if available, otherwise use initial students
    const savedStudents = localStorage.getItem('registeredStudents');
    if (savedStudents) {
      this.students = JSON.parse(savedStudents);
    } else {
      this.students = [...initialStudents];
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem('registeredStudents', JSON.stringify(this.students));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Get all students
  getStudents(): User[] {
    return [...this.students];
  }

  // Add a new student (when they register)
  addStudent(student: User) {
    // Check if student already exists
    const exists = this.students.some(s => s.email === student.email);
    if (!exists) {
      this.students.push({
        ...student,
        registrationDate: new Date().toISOString().split('T')[0] // Today's date
      });
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get student count
  getStudentCount(): number {
    return this.students.length;
  }
}

// Create and export a single instance
export const studentStore = new StudentStore();
