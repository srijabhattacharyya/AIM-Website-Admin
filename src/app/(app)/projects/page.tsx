"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initiatives, type Initiative, type Project, type User } from "@/lib/types";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";

export default function ProjectsPage() {
  const { user: authUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | "all">("all");
  const [hydrated, setHydrated] = useState(false);
  
  // Temporary user for development
  const devUser: User = {
    id: "user-admin-dev",
    name: "Dev Admin",
    email: "dev@example.com",
    avatarUrl: "https://picsum.photos/seed/dev/100/100",
    role: "Admin",
    status: "Active"
  };

  const user = authUser || devUser;


  useEffect(() => {
    setHydrated(true); 
    
    const loadProjects = () => {
      const storedProjectsString = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (storedProjectsString) {
        setProjects(JSON.parse(storedProjectsString));
      } else {
        setProjects([]);
      }
    };

    loadProjects();

    const handleStorageChange = () => loadProjects();

    window.addEventListener("projects-updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("projects-updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleDelete = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    window.dispatchEvent(new Event("projects-updated"));
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "default";
      case "Completed":
        return "secondary";
      case "Planning":
        return "outline";
      default:
        return "default";
    }
  };

  const filteredProjects =
    selectedInitiative === "all"
      ? projects
      : projects.filter((p) => p.initiative === selectedInitiative);

  if (!hydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex items-center gap-2">
          <Select
            value={selectedInitiative}
            onValueChange={(value) => setSelectedInitiative(value as any)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filter by initiative" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Initiatives</SelectItem>
              {initiatives.map((initiative) => (
                <SelectItem key={initiative} value={initiative}>
                  {initiative}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <Button asChild>
              <Link href="/projects/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                  data-ai-hint="community project"
                />
              </div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.initiative}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant={getBadgeVariant(project.status) as any}>
                {project.status}
              </Badge>
              {(user?.role === "Admin" || user?.role === "Manager") && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/projects/edit/${project.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit project</span>
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete project</span>
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
