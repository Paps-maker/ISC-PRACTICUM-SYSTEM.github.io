
import { Activity, User, UserRole } from "@/types";
import { notificationStore } from "@/stores/notificationStore";

// Remove mock activities - start with empty array
const mockActivities: Activity[] = [];

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

// Get students (mock) - returns empty array since we removed examples
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
