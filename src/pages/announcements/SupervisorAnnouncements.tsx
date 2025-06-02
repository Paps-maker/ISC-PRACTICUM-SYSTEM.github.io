
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Megaphone, Send, Plus, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, Announcement } from "@/types";
import { BackButton } from "@/components/ui/back-button";
import { AccessDenied } from "@/components/ui/access-denied";

const SupervisorAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState<UserRole[]>([UserRole.Student]);

  // Mock data for existing announcements
  useEffect(() => {
    const mockAnnouncements: Announcement[] = [
      {
        id: "1",
        title: "Practicum Midterm Evaluations",
        content: "All students are required to submit their midterm self-evaluations by Friday, June 7th. Please ensure all required documents are included.",
        createdBy: user?.id || "3",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        targetAudience: [UserRole.Student],
        priority: "high"
      },
      {
        id: "2",
        title: "Weekly Report Reminder",
        content: "Reminder to all students to submit your weekly reports every Friday by 5 PM. Late submissions will be marked accordingly.",
        createdBy: user?.id || "3",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        targetAudience: [UserRole.Student],
        priority: "medium"
      }
    ];
    setAnnouncements(mockAnnouncements);
  }, [user]);

  if (user?.role !== UserRole.Supervisor) {
    return <AccessDenied allowedRoles={[UserRole.Supervisor]} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newAnnouncement: Announcement = {
        id: `${announcements.length + 1}`,
        title,
        content,
        createdBy: user?.id || "3",
        createdAt: new Date().toISOString(),
        targetAudience,
        priority
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      
      toast({
        title: "Announcement sent",
        description: `Your announcement has been sent to ${targetAudience.join(", ")} users.`,
      });

      // Reset form
      setTitle("");
      setContent("");
      setPriority("medium");
      setTargetAudience([UserRole.Student]);
      setShowForm(false);
      setLoading(false);
    }, 1000);
  };

  const handleAudienceChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setTargetAudience([...targetAudience, role]);
    } else {
      setTargetAudience(targetAudience.filter(r => r !== role));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <BackButton to="/dashboard/supervisor" label="Back to Dashboard" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8" />
            Announcements
          </h1>
          <p className="text-muted-foreground">Send information and updates to students and instructors</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Send important information to students and instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter announcement title..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter announcement content..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Audience</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="students"
                        checked={targetAudience.includes(UserRole.Student)}
                        onCheckedChange={(checked) => handleAudienceChange(UserRole.Student, checked as boolean)}
                      />
                      <Label htmlFor="students">Students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instructors"
                        checked={targetAudience.includes(UserRole.Instructor)}
                        onCheckedChange={(checked) => handleAudienceChange(UserRole.Instructor, checked as boolean)}
                      />
                      <Label htmlFor="instructors">Instructors</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || targetAudience.length === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Announcement"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Previously sent announcements and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      {announcement.targetAudience.join(", ")}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{announcement.content}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(announcement.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            
            {announcements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No announcements sent yet.</p>
                <p className="text-sm">Click "New Announcement" to send your first announcement.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorAnnouncements;
