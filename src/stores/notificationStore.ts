
import { Notification, UserRole } from "@/types";
import { studentStore } from "./studentStore";

class NotificationStore {
  private notifications: Notification[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
    }
  }

  private saveToStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Send notification to all students about new activity
  notifyStudentsOfNewActivity(activityTitle: string, activityDescription: string) {
    const students = studentStore.getStudents();
    const newNotifications = students.map(student => ({
      id: `${Date.now()}-${student.id}`,
      userId: student.id,
      title: `New Activity: ${activityTitle}`,
      message: `A new activity has been added: ${activityDescription}`,
      type: 'activity' as const,
      read: false,
      createdAt: new Date().toISOString()
    }));

    this.notifications.push(...newNotifications);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Send notification to student when their submission is graded
  notifyStudentOfGrade(studentId: string, activityTitle: string, grade: number, feedback?: string) {
    const gradeNotification = {
      id: `grade-${Date.now()}-${studentId}`,
      userId: studentId,
      title: `Your submission has been graded`,
      message: `Your submission for "${activityTitle}" has been graded. You received ${grade}/100.${feedback ? ` Feedback: ${feedback.substring(0, 100)}${feedback.length > 100 ? '...' : ''}` : ''}`,
      type: 'grade' as const,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(gradeNotification);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Get notifications for a specific user
  getNotificationsForUser(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const notificationStore = new NotificationStore();
