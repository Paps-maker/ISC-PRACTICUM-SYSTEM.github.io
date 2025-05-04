import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/types";
import { getActivities } from "@/lib/api";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const ActivityList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { data: activities, isLoading, isError } = useQuery(
    {
      queryKey: ["activities", searchQuery, dateRange],
      queryFn: () => getActivities(searchQuery, dateRange?.from, dateRange?.to),
    }
  );
  
  useEffect(() => {
    document.title = "Activities | SPMS";
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (isError) {
    return <div className="text-red-500">Error fetching activities. Please try again later.</div>;
  }

  const filteredActivities = activities || [];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Button variant="outline" onClick={() => window.print()}>
          <span className="mr-2">Print</span>
        </Button>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
          <CardDescription>Filter activities based on title and date.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Search by activity title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CalendarDateRangePicker onDateChange={(range) => {
              setDateRange(range);
            }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity List</CardTitle>
          <CardDescription>List of all activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      <Link to={`/activities/${activity.id}`}>{activity.title}</Link>
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{format(new Date(activity.startDate), "PPP")}</TableCell>
                    <TableCell>{format(new Date(activity.endDate), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      {activity.endDate ? (
                        new Date(activity.endDate) < new Date() ? (
                          <Badge variant="destructive">Completed</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )
                      ) : (
                        <Badge variant="outline">N/A</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No activities found.
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

export default ActivityList;
