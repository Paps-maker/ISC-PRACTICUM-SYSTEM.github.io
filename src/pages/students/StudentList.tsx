
import React, { useState, useRef } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Printer, UserPlus, Users } from "lucide-react";
import { UserRole } from "@/types";

// Mock student data
const mockStudents = [
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

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow && printRef.current) {
      const content = printRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Registered Students</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { text-align: center; }
            </style>
          </head>
          <body>
            <h1>Registered Students</h1>
            ${content}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registered Students</h1>
          <p className="text-muted-foreground">Manage and view all registered students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Students</span>
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({filteredStudents.length})
              </span>
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={printRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{new Date(student.registrationDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
