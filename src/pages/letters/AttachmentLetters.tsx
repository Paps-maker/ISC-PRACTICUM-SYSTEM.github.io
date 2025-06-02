
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Printer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, User } from "@/types";
import { studentStore } from "@/stores/studentStore";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

interface EligibleStudent {
  student: User;
  completedActivities: number;
  totalActivities: number;
  completionPercentage: number;
  isEligible: boolean;
}

const AttachmentLetters: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setStudents(studentStore.getStudents());
    
    const unsubscribe = studentStore.subscribe(() => {
      setStudents(studentStore.getStudents());
    });
    
    return unsubscribe;
  }, []);

  // Mock data for demonstration - in real app, this would come from API
  const eligibleStudents: EligibleStudent[] = students.map(student => {
    const totalActivities = 4; // Mock total activities
    const completedActivities = Math.floor(Math.random() * (totalActivities + 1));
    const completionPercentage = Math.round((completedActivities / totalActivities) * 100);
    const isEligible = completionPercentage >= 80; // 80% completion threshold

    return {
      student,
      completedActivities,
      totalActivities,
      completionPercentage,
      isEligible
    };
  });

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const eligibleIds = eligibleStudents
        .filter(es => es.isEligible)
        .map(es => es.student.id);
      setSelectedStudents(eligibleIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleGenerateLetters = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to generate letters.",
        variant: "destructive",
      });
      return;
    }

    // Mock letter generation
    toast({
      title: "Letters Generated",
      description: `Generated attachment letters for ${selectedStudents.length} student(s).`,
    });

    // In a real app, this would trigger PDF generation and download
    console.log("Generating letters for students:", selectedStudents);
  };

  const handlePrintList = () => {
    window.print();
  };

  // Only instructors and supervisors should access this page
  if (user?.role !== UserRole.Instructor && user?.role !== UserRole.Supervisor) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <BackButton to="/dashboard" label="Back to Dashboard" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Attachment Letters</h1>
          <p className="text-muted-foreground">
            Generate attachment letters for eligible students (80%+ completion rate)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintList}>
            <Printer className="mr-2 h-4 w-4" />
            Print List
          </Button>
          <Button 
            onClick={handleGenerateLetters}
            disabled={selectedStudents.length === 0}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Letters ({selectedStudents.length})
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Eligibility Status</CardTitle>
        </CardHeader>
        <CardContent>
          {eligibleStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registered students found. Students need to register to appear in this list.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === eligibleStudents.filter(es => es.isEligible).length && eligibleStudents.some(es => es.isEligible)}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eligibleStudents.map((eligibleStudent) => (
                  <TableRow key={eligibleStudent.student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(eligibleStudent.student.id)}
                        onCheckedChange={(checked) => 
                          handleSelectStudent(eligibleStudent.student.id, checked as boolean)
                        }
                        disabled={!eligibleStudent.isEligible}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {eligibleStudent.student.name}
                    </TableCell>
                    <TableCell>{eligibleStudent.student.email}</TableCell>
                    <TableCell>
                      {eligibleStudent.completedActivities}/{eligibleStudent.totalActivities} activities
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-sm">
                          {eligibleStudent.completionPercentage}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={eligibleStudent.isEligible ? "default" : "secondary"}>
                        {eligibleStudent.isEligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttachmentLetters;
