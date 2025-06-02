
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const AttachmentLetters: React.FC = () => {
  const { user } = useAuth();

  const getDashboardUrl = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case UserRole.Student:
        return "/dashboard/student";
      case UserRole.Instructor:
        return "/dashboard/instructor";
      case UserRole.Supervisor:
        return "/dashboard/supervisor";
      default:
        return "/";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,Sample Attachment Letter Content');
    element.setAttribute('download', 'attachment-letter.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      <BackButton to={getDashboardUrl()} label="Back to Dashboard" />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Attachment Letters</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Official Practicum Attachment Letter
            </CardTitle>
            <CardDescription>
              Generate official letters for student practicum attachments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This section allows you to generate and manage official attachment letters for students
                participating in the practicum program. These letters serve as formal documentation
                for external organizations hosting our students.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Letter Contents Include:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Student information and program details</li>
                  <li>Practicum duration and objectives</li>
                  <li>Institution contact information</li>
                  <li>Supervisor and instructor details</li>
                  <li>Emergency contact information</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Generate New Letter</Button>
                <Button variant="outline">View Templates</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Letters</CardTitle>
            <CardDescription>
              Recently generated attachment letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No letters generated yet.</p>
              <p className="text-sm">Click "Generate New Letter" to create your first attachment letter.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttachmentLetters;
