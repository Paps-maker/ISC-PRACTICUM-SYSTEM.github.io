
import React, { useState, useEffect } from "react";
import { getStudents } from "@/lib/api";
import { User, UserRole } from "@/types";
import { 
  Table,
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { users, printer } from "lucide-react";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch students from API
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const fetchedStudents = await getStudents();
        // Filter to only include students
        const onlyStudents = fetchedStudents.filter(
          (user) => user.role === UserRole.Student
        );
        setStudents(onlyStudents);
        setFilteredStudents(onlyStudents);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  useEffect(() => {
    // Filter students based on search query
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registered Students</h1>
          <p className="text-muted-foreground">
            View and manage registered students
          </p>
        </div>

        <Button 
          onClick={handlePrint} 
          variant="outline" 
          className="mt-4 md:mt-0 print:hidden"
        >
          <printer className="mr-2 h-4 w-4" />
          Print Student List
        </Button>
      </div>

      <div className="mb-6 print:hidden">
        <Input
          type="search"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading students...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="print:hidden">List of registered students</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">Active</Badge>
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
                        <div>
                          <users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <div className="text-muted-foreground">No students registered yet</div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          nav, button, footer, .print-hidden {
            display: none !important;
          }
          
          body {
            font-size: 12pt;
            padding: 0.5in;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          th {
            background-color: #f2f2f2;
          }
          
          h1 {
            font-size: 18pt;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentList;
