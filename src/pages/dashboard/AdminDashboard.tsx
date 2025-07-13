
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Database, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { User, UserRole } from "@/types";
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

const AdminDashboard: React.FC = () => {
  const { user, getAllUsers, deleteUser, clearAllUserData } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (getAllUsers) {
      setUsers(getAllUsers());
    }
  }, [getAllUsers]);

  const handleDeleteUser = (userId: string, userName: string) => {
    if (deleteUser) {
      try {
        deleteUser(userId);
        setUsers(getAllUsers ? getAllUsers() : []);
        toast({
          title: "User deleted",
          description: `${userName} has been removed from the system.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete user",
        });
      }
    }
  };

  const handleClearAllData = () => {
    if (clearAllUserData) {
      clearAllUserData();
      setUsers(getAllUsers ? getAllUsers() : []);
      toast({
        title: "Data cleared",
        description: "All user data has been reset to default values.",
      });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return "bg-red-100 text-red-800";
      case UserRole.Supervisor:
        return "bg-purple-100 text-purple-800";
      case UserRole.Instructor:
        return "bg-blue-100 text-blue-800";
      case UserRole.Student:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (user?.role !== UserRole.Admin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage system users and data. Welcome, {user?.name}!
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === UserRole.Student).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === UserRole.Instructor || u.role === UserRole.Supervisor).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userData) => (
              <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{userData.name}</h3>
                    <Badge className={getRoleBadgeColor(userData.role)}>
                      {userData.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  {userData.schoolId && (
                    <p className="text-sm text-muted-foreground">School ID: {userData.schoolId}</p>
                  )}
                  {userData.registrationDate && (
                    <p className="text-xs text-muted-foreground">
                      Registered: {userData.registrationDate}
                    </p>
                  )}
                </div>
                
                {userData.role !== UserRole.Admin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {userData.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(userData.id, userData.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Data Management
          </CardTitle>
          <CardDescription>
            Dangerous actions that affect all system data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Clear All User Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All User Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete ALL users and reset the system to default demo accounts. 
                  This action cannot be undone. Are you absolutely sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearAllData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
