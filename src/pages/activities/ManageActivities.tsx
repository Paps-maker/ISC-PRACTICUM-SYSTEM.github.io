import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Printer, Users, FileText, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getActivities, deleteActivity } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { studentStore } from "@/stores/studentStore";
import { AccessDenied } from "@/components/ui/access-denied";

const ManageActivities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  });

  // Get students from the store
  useEffect(() => {
    setStudents(studentStore.getStudents());
    
    const unsubscribe = studentStore.subscribe(() => {
      setStudents(studentStore.getStudents());
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    document.title = "Manage Activities | SPMS";
  }, []);

  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteActivity = (activityId: string) => {
    deleteActivityMutation.mutate(activityId);
  };

  const handlePrintActivity = (activityId: string) => {
    window.print();
    
    toast({
      title: "Print initiated",
      description: "The activity document has been sent to the printer.",
    });
  };

  const filteredActivities = activities?.filter(activity => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (activitiesLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  // Allow both instructors and supervisors to access this page
  if (user?.role !== UserRole.Instructor && user?.role !== UserRole.Supervisor) {
    return <AccessDenied allowedRoles={[UserRole.Instructor, UserRole.Supervisor]} />;
  }

  // Count submissions per activity (would come from real data in a production app)
  const getSubmissionCount = (activityId: string) => {
    return Math.floor(Math.random() * (students?.length || 0));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Activities</h1>
          <p className="text-muted-foreground">Create, edit and monitor student activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print All
          </Button>
          <Link to="/activities/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Activity
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Activities</CardTitle>
          <CardDescription>Filter activities by title or description</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
          <CardDescription>
            Total: {filteredActivities.length} activities | {students?.length || 0} students registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => {
                  const submissionCount = getSubmissionCount(activity.id);
                  const isActive = new Date(activity.endDate) >= new Date();
                  
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Start: {format(new Date(activity.startDate), "PP")}</div>
                          <div>End: {format(new Date(activity.endDate), "PP")}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{submissionCount}</span>
                          <span className="text-muted-foreground">/ {students?.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Active" : "Ended"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedActivityId(activity.id)}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Student Submissions</DialogTitle>
                                <DialogDescription>
                                  Activity: {activity.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="max-h-[400px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Student</TableHead>
                                      <TableHead>Submission Date</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {students && students.slice(0, submissionCount).map((student) => (
                                      <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{format(new Date(), "PP")}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">Submitted</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    {submissionCount === 0 && (
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                          No submissions yet
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => window.print()}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print List
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePrintActivity(activity.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          
                          <Link to={`/activities/edit/${activity.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the activity
                                  "{activity.title}" and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteActivity(activity.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Link to={`/activities/${activity.id}`}>
                            <Button 
                              variant="default" 
                              size="sm"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      No activities found. 
                      {searchQuery ? " Try adjusting your search query." : " Create your first activity."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageActivities;
