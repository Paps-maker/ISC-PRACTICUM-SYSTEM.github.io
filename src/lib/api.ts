
import { Activity, User, UserRole } from "@/types";

// Mock data for activities
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Week 1: Company Introduction",
    description: "Write a brief introduction about the company you are interning with.",
    startDate: "2025-06-03T10:00:00Z",
    endDate: "2025-06-10T23:59:59Z",
    createdAt: "2025-05-01T10:00:00Z",
    createdBy: "2"
  },
  {
    id: "2",
    title: "Week 2: Department Overview",
    description: "Describe the department you are working in and its role within the company.",
    startDate: "2025-06-10T10:00:00Z",
    endDate: "2025-06-17T23:59:59Z",
    createdAt: "2025-05-01T10:05:00Z",
    createdBy: "2"
  },
  {
    id: "3",
    title: "Week 3: Daily Tasks Analysis",
    description: "Document and analyze the daily tasks you are performing.",
    startDate: "2025-06-17T10:00:00Z",
    endDate: "2025-06-24T23:59:59Z",
    createdAt: "2025-05-01T10:10:00Z",
    createdBy: "2"
  },
  {
    id: "4",
    title: "Week 4: Skills Development",
    description: "Reflect on the skills you have developed during your practicum.",
    startDate: "2025-06-24T10:00:00Z",
    endDate: "2025-07-01T23:59:59Z",
    createdAt: "2025-05-01T10:15:00Z",
    createdBy: "2"
  }
];

// Mock data for students
const mockStudents: User[] = [
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

// Get activities with optional filtering
export const getActivities = (
  searchQuery?: string,
  startDate?: Date,
  endDate?: Date
): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = [...mockActivities];
      
      // Filter by search query if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredActivities = filteredActivities.filter(
          (activity) => 
            activity.title.toLowerCase().includes(query) || 
            activity.description.toLowerCase().includes(query)
        );
      }
      
      // Filter by start date if provided
      if (startDate) {
        filteredActivities = filteredActivities.filter(
          (activity) => new Date(activity.startDate) >= startDate
        );
      }
      
      // Filter by end date if provided
      if (endDate) {
        filteredActivities = filteredActivities.filter(
          (activity) => new Date(activity.endDate) <= endDate
        );
      }
      
      resolve(filteredActivities);
    }, 500); // Simulated API delay
  });
};

// Get students (mock)
export const getStudents = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStudents);
    }, 300);
  });
};

// Create a new activity (mock)
export interface CreateActivityParams {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}

export const createActivity = (params: CreateActivityParams): Promise<Activity> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity: Activity = {
        id: `${mockActivities.length + 1}`,
        title: params.title,
        description: params.description,
        startDate: params.startDate,
        endDate: params.endDate,
        createdAt: new Date().toISOString(),
        createdBy: params.createdBy
      };
      
      mockActivities.push(newActivity);
      resolve(newActivity);
    }, 500);
  });
};

// Get activity by ID (mock)
export const getActivityById = (id: string): Promise<Activity | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activity = mockActivities.find(a => a.id === id);
      resolve(activity);
    }, 300);
  });
};
