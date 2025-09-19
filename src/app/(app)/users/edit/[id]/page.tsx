
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";

const USERS_STORAGE_KEY = "aim-foundation-users";
const ALL_ROLES: Role[] = ["Admin", "Manager", "Volunteer", "Intern", "Donor"];

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters." })
  .refine(value => /[A-Z]/.test(value), { message: "Password must contain at least one uppercase letter." })
  .refine(value => /[a-z]/.test(value), { message: "Password must contain at least one lowercase letter." })
  .refine(value => /\d/.test(value), { message: "Password must contain at least one number." })
  .refine(value => /[@$!%*?&]/.test(value), { message: "Password must contain at least one special character (@$!%*?&)." });

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.union([passwordSchema, z.literal('')]),
  role: z.enum(ALL_ROLES as [string, ...string[]]),
  status: z.enum(["Active", "Inactive"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const checkPasswordStrength = (password: string): number => {
  let strength = 0;
  if (!password) return 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  return (strength / 5) * 100;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { user: authUser } = useAuth();
  
  const devUser: User = {
    id: "user-admin-dev",
    name: "Dev Admin",
    email: "dev@example.com",
    avatarUrl: "https://picsum.photos/seed/dev/100/100",
    role: "Admin",
    status: "Active"
  };

  const currentUser = authUser || devUser;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Donor",
      status: "Active",
    },
  });

  const password = form.watch("password");
  const passwordStrength = checkPasswordStrength(password || "");

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  }

  useEffect(() => {
    if (!userId) return;

    const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsersString) {
      const storedUsers: User[] = JSON.parse(storedUsersString);
      const foundUser = storedUsers.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (user) {
      form.reset({
        ...user,
        password: "" // Don't pre-fill password
      });
    }
  }, [user, form]);
  
  let availableRoles: Role[] = [];
  if (currentUser) {
    switch (currentUser.role) {
      case "Admin":
        availableRoles = ALL_ROLES;
        break;
      case "Manager":
        availableRoles = ["Volunteer", "Intern", "Donor"];
        break;
    }
  }

  const onSubmit = (data: UserFormValues) => {
    const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    const storedUsers: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];

    const updatedUsers = storedUsers.map((u) => {
      if (u.id === userId) {
        const updatedUser: Partial<User> = {
          ...u, // preserve avatarUrl and id
          ...data, // apply form changes
        };
        // Only update password if a new one was entered
        if (!data.password) {
          delete updatedUser.password;
        }
        return updatedUser as User;
      }
      return u;
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event("users-updated"));
    router.push("/users");
  };
  
  const canEditRole = () => {
    if (!currentUser || !user) return false;
    if (currentUser.id === user.id) return false;
    if (currentUser.role === 'Admin') return true;
    if (currentUser.role === 'Manager') {
       return ['Volunteer', 'Intern', 'Donor'].includes(user.role);
    }
    return false;
  }

  const canEditStatus = () => {
    if (!currentUser || !user) return false;
    // You cannot deactivate yourself
    if (currentUser.id === user.id) return false;
    if (currentUser.role === 'Admin') return true;
    if (currentUser.role === 'Manager') {
       return ['Volunteer', 'Intern', 'Donor'].includes(user.role);
    }
    return false;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-destructive">User not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Edit User</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Update the user's information below.</CardDescription>
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="Leave blank to keep current" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                     {password && (
                        <div className="space-y-2 pt-1">
                          <Progress value={passwordStrength} className={`h-2 ${getStrengthColor(passwordStrength)}`}/>
                          <p className="text-xs text-muted-foreground">
                            Password must contain uppercase, lowercase, number, and special character.
                          </p>
                        </div>
                      )}
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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!canEditRole()}
                    >
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!canEditStatus()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    