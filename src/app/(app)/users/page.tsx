"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allMockUsers } from "@/lib/data";
import { type Role, type User } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Loader2 } from "lucide-react";

const USERS_STORAGE_KEY = "aim-foundation-users";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [hydrated, setHydrated] = useState(false);
  
  const roles: Role[] = ["Admin", "Manager", "Volunteer", "Intern", "Donor"];

  useEffect(() => {
    setHydrated(true);

    const loadUsers = () => {
      const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsersString && storedUsersString !== "[]") {
        setUsers(JSON.parse(storedUsersString));
      } else if (!storedUsersString) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allMockUsers));
        setUsers(allMockUsers);
      } else {
        setUsers([]);
      }
    };

    loadUsers();

    const handleStorageChange = () => loadUsers();
    window.addEventListener("users-updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("users-updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleRoleChange = (userId: string, newRole: Role) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event("users-updated"));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

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
        <h1 className="font-headline text-3xl font-bold tracking-tight">User Management</h1>
        {currentUser?.role === "Admin" && (
          <Button asChild>
            <Link href="/users/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="w-32 ml-auto">
                        <Select 
                          value={user.role}
                          onValueChange={(newRole: Role) => handleRoleChange(user.id, newRole)}
                          disabled={currentUser?.role !== 'Admin'}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
