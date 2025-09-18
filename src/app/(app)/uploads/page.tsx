"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUploads } from "@/lib/data";
import { Upload as UploadIcon, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/lib/types";

export default function UploadsPage() {
  const { user: authUser } = useAuth();
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
  }, []);

  const canManageUploads = user?.role === "Admin" || user?.role === "Manager";

  if (!hydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Photo Library</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Browse all uploaded files.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockUploads.map(upload => (
                <div key={upload.id} className="group relative aspect-w-1 aspect-h-1">
                  <Image 
                    src={upload.url} 
                    alt={upload.name} 
                    width={200} 
                    height={200} 
                    className="rounded-lg object-cover"
                    data-ai-hint="event file"
                  />
                  {canManageUploads && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Add new files to the gallery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="upload-file">Select File</Label>
                <Input id="upload-file" type="file" />
              </div>
              <Button className="w-full">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
