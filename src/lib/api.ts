
import { Activity, User, UserRole } from "@/types";
import { notificationStore } from "@/stores/notificationStore";

// Mock data for activities
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

// Get activities with optional filtering
export const getActivities = (
  searchQuery?: string,
  startDate?: Date,
  endDate?: Date
): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = [...mockActivities];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredActivities = filteredActivities.filter(
          (activity) => 
            activity.title.toLowerCase().includes(query) || 
            activity.description.toLowerCase().includes(query)
        );
      }
      
      if (startDate) {
        filteredActivities = filteredActivities.filter(
          (activity) => new Date(activity.startDate) >= startDate
        );
      }
      
      if (endDate) {
        filteredActivities = filteredActivities.filter(
          (activity) => new Date(activity.endDate) <= endDate
        );
      }
      
      resolve(filteredActivities);
    }, 500);
  });
};

// Get students (mock) - now returns empty array since we removed examples
export const getStudents = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
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
        deadline: params.endDate, // Use endDate as deadline
        createdAt: new Date().toISOString(),
        createdBy: params.createdBy
      };
      
      mockActivities.push(newActivity);
      
      // Notify all students about the new activity
      notificationStore.notifyStudentsOfNewActivity(newActivity.title, newActivity.description);
      
      resolve(newActivity);
    }, 500);
  });
};

// Update an activity
export const updateActivity = (id: string, params: Partial<CreateActivityParams>): Promise<Activity> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activityIndex = mockActivities.findIndex(a => a.id === id);
      if (activityIndex === -1) {
        reject(new Error('Activity not found'));
        return;
      }
      
      mockActivities[activityIndex] = {
        ...mockActivities[activityIndex],
        ...params
      };
      
      resolve(mockActivities[activityIndex]);
    }, 500);
  });
};

// Delete an activity
export const deleteActivity = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activityIndex = mockActivities.findIndex(a => a.id === id);
      if (activityIndex === -1) {
        reject(new Error('Activity not found'));
        return;
      }
      
      mockActivities.splice(activityIndex, 1);
      resolve();
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
