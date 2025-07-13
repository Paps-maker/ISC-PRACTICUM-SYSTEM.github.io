import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/layout/NavBar';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import StudentDashboard from '@/pages/dashboard/StudentDashboard';
import InstructorDashboard from '@/pages/dashboard/InstructorDashboard';
import SupervisorDashboard from '@/pages/dashboard/SupervisorDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import ActivityList from '@/pages/activities/ActivityList';
import ActivityDetails from '@/pages/activities/ActivityDetails';
import ActivityForm from '@/pages/activities/ActivityForm';
import EditActivity from '@/pages/activities/EditActivity';
import ManageActivities from '@/pages/activities/ManageActivities';
import StudentList from '@/pages/students/StudentList';
import SubmissionForm from '@/pages/submissions/SubmissionForm';
import EditSubmission from '@/pages/submissions/EditSubmission';
import SubmissionList from '@/pages/submissions/SubmissionList';
import StudentSubmissions from '@/pages/submissions/StudentSubmissions';
import GradeSubmission from '@/pages/submissions/GradeSubmission';
import SubmissionsGrade from '@/pages/submissions/SubmissionsGrade';
import SupervisorAnnouncements from '@/pages/announcements/SupervisorAnnouncements';
import AttachmentLetters from '@/pages/letters/AttachmentLetters';
import ProgressReports from '@/pages/reports/ProgressReports';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();
  const showSidebar = !!user;

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex flex-1 h-full overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="h-full w-full p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
              <Route path="/dashboard/supervisor" element={<SupervisorDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/:activityId" element={<ActivityDetails />} />
              <Route path="/activities/new" element={<ActivityForm />} />
              <Route path="/activities/create" element={<ActivityForm />} />
              <Route path="/activities/edit/:id" element={<EditActivity />} />
              <Route path="/activities/manage" element={<ManageActivities />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/submissions" element={<StudentSubmissions />} />
              <Route path="/submissions/new" element={<SubmissionForm />} />
              <Route path="/submissions/edit/:submissionId" element={<EditSubmission />} />
              <Route path="/submissions/review" element={<SubmissionList />} />
              <Route path="/submissions/:submissionId" element={<GradeSubmission />} />
              <Route path="/submissions/:submissionId/grade" element={<GradeSubmission />} />
              <Route path="/submissions/grade" element={<SubmissionsGrade />} />
              <Route path="/announcements" element={<SupervisorAnnouncements />} />
              <Route path="/letters/attachment" element={<AttachmentLetters />} />
              <Route path="/reports" element={<ProgressReports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
