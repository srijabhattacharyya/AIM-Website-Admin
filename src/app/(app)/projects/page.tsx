"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/data";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { initiatives, type Initiative, type Project } from "@/lib/types";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | "all">("all");

  useEffect(() => {
    const storedProjects = localStorage.getItem("aim-foundation-projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem("aim-foundation-projects", JSON.stringify(mockProjects));
    }
  }, []);

  const handleDelete = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("aim-foundation-projects", JSON.stringify(updatedProjects));
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'default';
      case 'Completed': return 'secondary';
      case 'Planning': return 'outline';
      default: return 'default';
    }
  };
  
  const filteredProjects = selectedInitiative === "all" 
    ? projects 
    : projects.filter(p => p.initiative === selectedInitiative);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex items-center gap-2">
            <Select value={selectedInitiative} onValueChange={(value) => setSelectedInitiative(value as any)}>
                <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Filter by initiative" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Initiatives</SelectItem>
                    {initiatives.map(initiative => (
                        <SelectItem key={initiative} value={initiative}>{initiative}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {(user?.role === 'Admin' || user?.role === 'Manager') && (
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
        {filteredProjects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                  <Image src={project.imageUrl} alt={project.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="community project" />
              </div>
              <CardTitle>{project.name}</CardTitle>
               <CardDescription>{project.initiative}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant={getBadgeVariant(project.status) as any}>{project.status}</Badge>
              {(user?.role === 'Admin' || user?.role === 'Manager') && (
                <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete project</span>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
