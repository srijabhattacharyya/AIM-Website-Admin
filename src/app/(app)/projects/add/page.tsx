
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { initiatives, type Project, type Initiative } from "@/lib/types";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";

const projectFormSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  initiative: z.enum([...initiatives] as [string, ...string[]]),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(["Planning", "Ongoing", "Completed"]),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).or(z.string().length(0)),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function AddProjectPage() {
  const router = useRouter();

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

  const onSubmit = (data: ProjectFormValues) => {
    const storedProjectsString = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const storedProjects: Project[] = storedProjectsString ? JSON.parse(storedProjectsString) : [];

    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
      imageUrl: data.imageUrl || `https://picsum.photos/seed/${data.name}/400/200`,
      progress: 0,
      budget: 0,
    };

    const updatedProjects = [...storedProjects, newProject];

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    window.dispatchEvent(new Event("projects-updated"));
    router.push("/projects");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Add New Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fill out the form to create a new project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Community Health Camp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initiative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiative</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of project goals..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project status" />
                        </SelectTrigger>
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

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://picsum.photos/seed/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Project
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
