"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { initiatives, type Project } from "@/lib/types";
import { Loader2 } from "lucide-react";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";

// ✅ Validation Schema
const projectFormSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  initiative: z.enum([...initiatives] as [string, ...string[]]),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(["Planning", "Ongoing", "Completed"]),
  imageUrl: z
    .string()
    .url({ message: "Please enter a valid image URL." })
    .or(z.string().length(0)),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      initiative: initiatives[0],
      description: "",
      status: "Planning",
      imageUrl: "",
    },
  });

  // ✅ Hydration + Load Project
  useEffect(() => {
    if (!projectId) return;

    const storedProjectsString = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        const found = storedProjects.find((p) => p.id === projectId);
        if (found) {
            setProject(found);
        }
    }
    setLoading(false);
  }, [projectId]);

  // ✅ Sync form after project is loaded
  useEffect(() => {
    if (project) {
        form.reset({
            name: project.name,
            initiative: project.initiative,
            description: project.description,
            status: project.status,
            imageUrl: project.imageUrl || "",
        });
    }
  }, [project, form]);


  const onSubmit = (data: ProjectFormValues) => {
    const storedProjectsString = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const storedProjects: Project[] = storedProjectsString ? JSON.parse(storedProjectsString) : [];

    const updatedProjects = storedProjects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            ...data,
            imageUrl: data.imageUrl || `https://picsum.photos/seed/${data.name}/400/200`,
          }
        : p
    );

    // ✅ Save
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));

    // ✅ Sync other pages
    window.dispatchEvent(new Event("projects-updated"));

    // ✅ Redirect
    router.push("/projects");
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!project) {
    return <p className="text-center text-destructive">Project not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Project Details</CardTitle>
          <CardDescription>Modify the fields below to update your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Initiative */}
              <FormField
                control={form.control}
                name="initiative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiative</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an initiative" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {initiatives.map((initiative) => (
                          <SelectItem key={initiative} value={initiative}>
                            {initiative}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project status" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update Project
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
