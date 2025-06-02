
import { User, UserRole } from "@/types";

// Student store that manages the list of registered students
class StudentStore {
  private students: User[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Load students from localStorage if available, otherwise empty array
    const savedStudents = localStorage.getItem('registeredStudents');
    if (savedStudents) {
      this.students = JSON.parse(savedStudents);
    } else {
      this.students = [];
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
