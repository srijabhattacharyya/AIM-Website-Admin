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
import { type User, type Role } from "@/lib/types";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const USERS_STORAGE_KEY = "aim-foundation-users";
const ALL_ROLES: Role[] = ["Admin", "Manager", "Volunteer", "Intern", "Donor"];

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(ALL_ROLES as [string, ...string[]]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const availableRoles = currentUser?.role === "Manager"
      ? ["Volunteer", "Intern", "Donor"]
      : ALL_ROLES;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Volunteer",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (!hydrated) return;

    const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    const storedUsers: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      avatarUrl: `https://picsum.photos/seed/${data.name.split(' ')[0]}/100/100`,
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event("users-updated"));
    router.push("/users");
  };

  if (!hydrated || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Add New User</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Fill out the form to create a new user account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Alex Ray" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. alex.ray@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create User
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
