"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initiatives, type Project, type Initiative } from "@/lib/types";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";

export default function AddProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [initiative, setInitiative] = useState<Initiative>(initiatives[0]);
  const [status, setStatus] = useState<"Planning" | "Ongoing" | "Completed">("Planning");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!initiative) {
      // Or handle error appropriately
      alert("Please select an initiative.");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      initiative,
      status,
      description,
      imageUrl:
        imageUrl.trim() ||
        "https://picsum.photos/seed/newproject/400/200",
      progress: 0,
      budget: 0,
    };

    const storedProjectsString = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const storedProjects: Project[] = storedProjectsString
      ? JSON.parse(storedProjectsString)
      : [];

    const updatedProjects = [...storedProjects, newProject];

    // ✅ Save to localStorage
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));

    // ✅ Notify other components (ProjectsPage) immediately
    window.dispatchEvent(new Event("projects-updated"));

    // ✅ Redirect back to projects list
    router.push("/projects");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Add New Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initiative">Initiative</Label>
              <Select onValueChange={(value) => setInitiative(value as Initiative)} defaultValue={initiative}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an initiative" />
                </SelectTrigger>
                <SelectContent>
                  {initiatives.map((init) => (
                    <SelectItem key={init} value={init}>
                      {init}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://picsum.photos/seed/project/400/200"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Save Project
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
