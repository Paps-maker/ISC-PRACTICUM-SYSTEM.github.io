
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Printer, Search } from "lucide-react";
import { User, UserRole } from "@/types";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      const mockStudents: User[] = [
        {
          id: "1",
          name: "John Smith",
          email: "johnsmith@example.com",
          role: UserRole.Student
        },
        {
          id: "2",
          name: "Emily Johnson",
          email: "emilyjohnson@example.com",
          role: UserRole.Student
        },
        {
          id: "3",
          name: "Michael Brown",
          email: "michaelbrown@example.com",
          role: UserRole.Student
        },
        {
          id: "4",
          name: "Sarah Davis",
          email: "sarahdavis@example.com",
          role: UserRole.Student
        },
        {
          id: "5",
          name: "David Wilson",
          email: "davidwilson@example.com",
          role: UserRole.Student
        }
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage registered students</p>
        </div>
        <Button onClick={handlePrint} className="mt-4 sm:mt-0 print:hidden">
          <Printer className="mr-2 h-4 w-4" /> Print List
        </Button>
      </div>

      <div className="mb-6 print:hidden">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading students...</p>
          </div>
        ) : (
          <Table>
            <TableCaption>List of registered students</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    {searchQuery ? (
                      <div className="text-muted-foreground">
                        No students found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No students registered yet
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <style jsx global>
        {`
          @media print {
            body {
              font-size: 12pt;
            }
            .container {
              width: 100%;
              max-width: 100%;
              padding: 0;
            }
            h1 {
              font-size: 18pt;
              margin-bottom: 10pt;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8pt;
              text-align: left;
              border-bottom: 1pt solid #ddd;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StudentList;
