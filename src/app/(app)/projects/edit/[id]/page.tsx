"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { initiatives, type Project } from "@/lib/types";
import { Loader2 } from "lucide-react";

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  initiative: z.enum([...initiatives] as [string, ...string[]]),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["Planning", "Ongoing", "Completed"]),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function EditProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Planning",
      imageUrl: "",
      initiative: initiatives[0],
    },
  });

  useEffect(() => {
    if (projectId) {
      const storedProjectsString = localStorage.getItem("aim-foundation-projects");
      if (storedProjectsString) {
        const storedProjects: Project[] = JSON.parse(storedProjectsString);
        const projectToEdit = storedProjects.find(p => p.id === projectId);
        if (projectToEdit) {
          form.reset(projectToEdit);
        } else {
          toast({ variant: "destructive", title: "Error", description: "Project not found." });
          router.push("/projects");
        }
      }
    }
  }, [projectId, form, router, toast]);

  function onSubmit(data: ProjectFormValues) {
    const storedProjectsString = localStorage.getItem("aim-foundation-projects");
    const storedProjects: Project[] = storedProjectsString ? JSON.parse(storedProjectsString) : [];
    
    const updatedProjects = storedProjects.map(p => 
      p.id === projectId ? { ...p, ...data } : p
    );

    localStorage.setItem("aim-foundation-projects", JSON.stringify(updatedProjects));

    // Dispatch custom event so ProjectsPage refreshes
    window.dispatchEvent(new Event("projects-updated"));

    toast({
      title: "Project Updated",
      description: `The project "${data.name}" has been successfully updated.`,
    });
    router.push("/projects");
  }

  if (!form.formState.isDirty) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update the form below to edit the project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiative Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Community Health Camp"
                        {...field}
                      />
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                      <Textarea
                        placeholder="A brief description of the project goals and activities."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can use a placeholder from{" "}
                      <a
                        href="https://picsum.photos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        picsum.photos
                      </a>
                      .
                    </FormDescription>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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

              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
