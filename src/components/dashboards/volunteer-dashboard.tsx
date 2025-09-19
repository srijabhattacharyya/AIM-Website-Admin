
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import type { Project, Task } from "@/lib/types";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";
const TASKS_STORAGE_KEY = "aim-foundation-tasks";

export default function VolunteerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if(storedProjects) setProjects(JSON.parse(storedProjects));

    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if(storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  const assignedProjects = projects.slice(0, 2); 
  const volunteerTasks = tasks.slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assigned Projects</CardTitle>
          <CardDescription>Projects you are currently contributing to.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedProjects.map(project => (
            <div key={project.id} className="flex items-center justify-between rounded-lg border p-4">
              <span className="font-semibold">{project.name}</span>
              <span className="text-sm text-muted-foreground">{project.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Task Checklist</CardTitle>
          <CardDescription>Your current tasks and activities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {volunteerTasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3">
              <Checkbox id={`task-${task.id}`} checked={task.completed} />
              <label
                htmlFor={`task-${task.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {task.title}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Access training materials and uploaded files.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Link href="/uploads">
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Training & Uploads</h3>
                <p className="text-sm text-muted-foreground">View guides and uploaded files.</p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
