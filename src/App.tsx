
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/layout/NavBar';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import StudentDashboard from '@/pages/dashboard/StudentDashboard';
import InstructorDashboard from '@/pages/dashboard/InstructorDashboard';
import SupervisorDashboard from '@/pages/dashboard/SupervisorDashboard';
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
import AttachmentLetters from '@/pages/letters/AttachmentLetters';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
              <Route path="/dashboard/supervisor" element={<SupervisorDashboard />} />
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
              <Route path="/submissions/grade/:submissionId" element={<SubmissionsGrade />} />
              <Route path="/letters/attachment" element={<AttachmentLetters />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
