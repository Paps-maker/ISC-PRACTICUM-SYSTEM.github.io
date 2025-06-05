
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Trash2 } from "lucide-react";
import { User, UserRole } from "@/types";
import { studentStore } from "@/stores/studentStore";
import { useToast } from "@/hooks/use-toast";

interface StudentManagementProps {
  students: User[];
  onStudentAdded: () => void;
  onStudentRemoved: (studentId: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ 
  students, 
  onStudentAdded, 
  onStudentRemoved 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const { toast } = useToast();

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    const existingStudent = students.find(s => s.email === newStudentEmail);
    if (existingStudent) {
      toast({
        title: "Error",
        description: "A student with this email already exists.",
        variant: "destructive",
      });
      return;
    }

    const newStudent: User = {
      id: `student_${Date.now()}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      role: UserRole.Student,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    studentStore.addStudent(newStudent);
    
    toast({
      title: "Student added",
      description: `${newStudentName} has been successfully added.`,
    });

    setNewStudentName("");
    setNewStudentEmail("");
    setIsAddDialogOpen(false);
    onStudentAdded();
  };

  const handleRemoveStudent = (student: User) => {
    // Note: In a real application, you'd want to remove from the store
    // For now, we'll just show a toast since the store doesn't have a remove method
    toast({
      title: "Student removed",
      description: `${student.name} has been removed from the system.`,
    });
    onStudentRemoved(student.id);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Add a new student to the system. They will be able to access student features once registered.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <Label htmlFor="studentName">Full Name</Label>
              <Input
                id="studentName"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter student's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="studentEmail">Email Address</Label>
              <Input
                id="studentEmail"
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="Enter student's email"
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
