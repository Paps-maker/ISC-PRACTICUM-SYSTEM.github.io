import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, FileText, CheckCircle, User, Upload, File } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { User as UserType, UserRole, Activity, Submission, SubmissionStatus } from "@/types";
import { AccessDenied } from "@/components/ui/access-denied";
import { FileUpload } from "@/components/FileUpload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface EligibleStudent {
  student: UserType;
  completedActivities: number;
  totalActivities: number;
  attachmentLetter?: {
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  };
}

const AttachmentLetters: React.FC = () => {
  const { user } = useAuth();
  const [eligibleStudents, setEligibleStudents] = useState<EligibleStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<string | null>(null);

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

  useEffect(() => {
    const mockStudents: UserType[] = [
      {
        id: "1",
        name: "John Student",
        email: "student@example.com",
        role: UserRole.Student
      },
      {
        id: "4",
        name: "Emma Johnson",
        email: "emma@example.com",
        role: UserRole.Student
      },
      {
        id: "5",
        name: "Michael Smith",
        email: "michael@example.com",
        role: UserRole.Student
      },
      {
        id: "6",
        name: "Sophia Williams",
        email: "sophia@example.com",
        role: UserRole.Student
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: "1",
        title: "Week 1: Company Introduction",
        description: "Write a brief introduction about the company you are interning with.",
        startDate: "2025-06-03T10:00:00Z",
        endDate: "2025-06-10T23:59:59Z",
        deadline: "2025-06-10T23:59:59Z",
        createdAt: "2025-05-01T10:00:00Z",
        createdBy: "2"
      },
      {
        id: "2",
        title: "Week 2: Department Overview",
        description: "Describe the department you are working in and its role within the company.",
        startDate: "2025-06-10T10:00:00Z",
        endDate: "2025-06-17T23:59:59Z",
        deadline: "2025-06-17T23:59:59Z",
        createdAt: "2025-05-01T10:05:00Z",
        createdBy: "2"
      },
      {
        id: "3",
        title: "Week 3: Daily Tasks Analysis",
        description: "Document and analyze the daily tasks you are performing.",
        startDate: "2025-06-17T10:00:00Z",
        endDate: "2025-06-24T23:59:59Z",
        deadline: "2025-06-24T23:59:59Z",
        createdAt: "2025-05-01T10:10:00Z",
        createdBy: "2"
      },
      {
        id: "4",
        title: "Week 4: Skills Development",
        description: "Reflect on the skills you have developed during your practicum.",
        startDate: "2025-06-24T10:00:00Z",
        endDate: "2025-07-01T23:59:59Z",
        deadline: "2025-07-01T23:59:59Z",
        createdAt: "2025-05-01T10:15:00Z",
        createdBy: "2"
      }
    ];

    const mockSubmissions: Submission[] = [
      {
        id: "1",
        activityId: "1",
        studentId: "1",
        fileName: "company_intro.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T14:30:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "2",
        activityId: "2",
        studentId: "1",
        fileName: "department_overview.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-15T16:45:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "3",
        activityId: "3",
        studentId: "1",
        fileName: "daily_tasks.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-22T12:30:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "4",
        activityId: "4",
        studentId: "1",
        fileName: "skills_development.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-29T10:15:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "5",
        activityId: "1",
        studentId: "4",
        fileName: "company_intro_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-09T10:15:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "6",
        activityId: "2",
        studentId: "4",
        fileName: "department_overview_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-16T14:20:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "7",
        activityId: "3",
        studentId: "4",
        fileName: "daily_tasks_emma.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-23T09:45:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "8",
        activityId: "1",
        studentId: "5",
        fileName: "company_intro_michael.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-08T16:00:00Z",
        status: SubmissionStatus.Reviewed
      },
      {
        id: "9",
        activityId: "2",
        studentId: "5",
        fileName: "department_overview_michael.pdf",
        fileUrl: "#",
        submittedAt: "2025-06-15T11:30:00Z",
        status: SubmissionStatus.Reviewed
      }
    ];

    const eligible: EligibleStudent[] = mockStudents.map(student => {
      const studentSubmissions = mockSubmissions.filter(s => s.studentId === student.id);
      const completedActivities = studentSubmissions.filter(s => 
        s.status === SubmissionStatus.Reviewed || s.status === SubmissionStatus.Graded
      ).length;
      
      return {
        student,
        completedActivities,
        totalActivities: mockActivities.length,
        attachmentLetter: student.id === "1" ? {
          fileName: "attachment_letter_john.pdf",
          fileUrl: "#",
          uploadedAt: "2025-06-06T10:00:00Z"
        } : undefined
      };
    }).filter(item => item.completedActivities === item.totalActivities);

    setEligibleStudents(eligible);
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,Sample Attachment Letter Content');
    element.setAttribute('download', 'attachment-letter.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateLetterForStudent = (student: UserType) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,Attachment Letter for ${student.name}`);
    element.setAttribute('download', `attachment-letter-${student.name.replace(' ', '-').toLowerCase()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (file: File, studentId: string) => {
    const newAttachmentLetter = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    };

    setEligibleStudents(prev => 
      prev.map(item => 
        item.student.id === studentId 
          ? { ...item, attachmentLetter: newAttachmentLetter }
          : item
      )
    );

    toast({
      title: "Letter Uploaded",
      description: `Attachment letter uploaded successfully for ${eligibleStudents.find(s => s.student.id === studentId)?.student.name}`,
    });

    setUploadDialogOpen(null);
  };

  const downloadAttachmentLetter = (student: UserType, attachmentLetter: { fileName: string; fileUrl: string }) => {
    const element = document.createElement('a');
    element.setAttribute('href', attachmentLetter.fileUrl);
    element.setAttribute('download', attachmentLetter.fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (user?.role !== UserRole.Instructor && user?.role !== UserRole.Supervisor) {
    return <AccessDenied allowedRoles={[UserRole.Instructor, UserRole.Supervisor]} />;
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
            Download Template
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Eligible Students for Attachment Letters
            </CardTitle>
            <CardDescription>
              Students who have completed all required activities and are eligible for attachment letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading students...</span>
              </div>
            ) : eligibleStudents.length > 0 ? (
              <div className="space-y-4">
                {eligibleStudents.map((item) => (
                  <div key={item.student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{item.student.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.student.email}</p>
                        {item.attachmentLetter && (
                          <div className="flex items-center gap-2 mt-1">
                            <File className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">Letter uploaded</span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        All Activities Completed
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {item.attachmentLetter ? (
                        <>
                          <Button
                            onClick={() => downloadAttachmentLetter(item.student, item.attachmentLetter!)}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Letter
                          </Button>
                          <Dialog open={uploadDialogOpen === item.student.id} onOpenChange={(open) => setUploadDialogOpen(open ? item.student.id : null)}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Replace Letter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Replace Attachment Letter</DialogTitle>
                                <DialogDescription>
                                  Upload a new attachment letter for {item.student.name}
                                </DialogDescription>
                              </DialogHeader>
                              <FileUpload
                                onFileSelect={(file) => handleFileUpload(file, item.student.id)}
                                acceptedFileTypes=".pdf,.docx,.doc"
                                maxSize={5}
                              />
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => generateLetterForStudent(item.student)}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generate Template
                          </Button>
                          <Dialog open={uploadDialogOpen === item.student.id} onOpenChange={(open) => setUploadDialogOpen(open ? item.student.id : null)}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Letter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Attachment Letter</DialogTitle>
                                <DialogDescription>
                                  Upload the attachment letter for {item.student.name}
                                </DialogDescription>
                              </DialogHeader>
                              <FileUpload
                                onFileSelect={(file) => handleFileUpload(file, item.student.id)}
                                acceptedFileTypes=".pdf,.docx,.doc"
                                maxSize={5}
                              />
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No students have completed all activities yet.</p>
                <p className="text-sm">Students must complete all required activities to be eligible for attachment letters.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letter Information</CardTitle>
            <CardDescription>
              Details about the attachment letter process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Letter Contents Include:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Student information and program details</li>
                  <li>Practicum duration and objectives</li>
                  <li>Institution contact information</li>
                  <li>Supervisor and instructor details</li>
                  <li>Emergency contact information</li>
                  <li>Confirmation of completed activities</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Eligibility Requirements:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Student must have submitted all required activities</li>
                  <li>All submissions must be reviewed and approved</li>
                  <li>Student must be in good academic standing</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Upload Guidelines:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Supported formats: PDF, Word documents (.docx, .doc)</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Ensure the letter is properly signed and formatted</li>
                  <li>Letters can be replaced if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttachmentLetters;
