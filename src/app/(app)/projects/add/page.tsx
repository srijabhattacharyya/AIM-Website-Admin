"use client";

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
import { useRouter } from "next/navigation";
import { initiatives, type Project } from "@/lib/types";
import { mockProjects } from "@/lib/data";

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

export default function AddProjectPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Planning",
      imageUrl: "https://picsum.photos/seed/newproject/600/400",
      initiative: initiatives[0],
    },
  });

  function onSubmit(data: ProjectFormValues) {
    const storedProjects = localStorage.getItem("aim-foundation-projects");
    const projects = storedProjects ? JSON.parse(storedProjects) : mockProjects;
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      ...data,
      progress: 0,
      budget: 0,
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem("aim-foundation-projects", JSON.stringify(updatedProjects));

    toast({
      title: "Project Created",
      description: `The project "${data.name}" has been successfully created.`,
    });
    router.push("/projects");
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Add New Project
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill out the form below to add a new project.
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
                      defaultValue={field.value}
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
                      defaultValue={field.value}
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

              <Button type="submit">Create Project</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
