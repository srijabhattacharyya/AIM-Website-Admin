
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload as UploadIcon, Trash2, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import type { User, Upload, Initiative } from "@/lib/types";
import { initiatives } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const UPLOADS_STORAGE_KEY = "aim-foundation-uploads";

const uploadFormSchema = z.object({
  file: z
    .any()
    .refine((files) => typeof window === 'undefined' || (files instanceof FileList && files.length > 0), "A file is required."),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  initiative: z.enum([...initiatives] as [string, ...string[]]),
  initiative2: z.enum([...initiatives, "__none__"] as [string, ...string[]])
    .optional()
    .transform((val) => (val === "__none__" ? undefined : val)),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export default function UploadsPage() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    const loadUploads = () => {
      const storedUploads = localStorage.getItem(UPLOADS_STORAGE_KEY);
      if (storedUploads) {
        setUploads(JSON.parse(storedUploads));
      }
    };
    loadUploads();
    window.addEventListener('storage', loadUploads);
    return () => window.removeEventListener('storage', loadUploads);
  }, []);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      description: "",
      initiative: initiatives[0],
      initiative2: "__none__",
    },
  });

  const onSubmit = (data: UploadFormValues) => {
    setIsUploading(true);
    const file = data.file[0];

    // Simulate upload and get a URL
    setTimeout(() => {
      const newUpload: Upload = {
        id: `upload-${Date.now()}`,
        name: file.name,
        url: `https://picsum.photos/seed/${Date.now()}/600/400`, // Placeholder URL
        uploadedAt: new Date().toISOString(),
        description: data.description,
        initiative: data.initiative,
        initiative2: data.initiative2,
      };

      const updatedUploads = [...uploads, newUpload];
      setUploads(updatedUploads);
      localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(updatedUploads));
      
      toast({ title: "File Uploaded", description: `${file.name} has been added to the gallery.` });
      form.reset();
      setIsUploading(false);
    }, 1000);
  };
  
  const handleDelete = (uploadId: string) => {
    const updatedUploads = uploads.filter(u => u.id !== uploadId);
    setUploads(updatedUploads);
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(updatedUploads));
    toast({ title: "File Deleted", description: "The file has been removed from the gallery." });
  }

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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription>Add new photos to the gallery.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Select File (600x400 recommended)</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={e => onChange(e.target.files)} {...rest} />
                        </FormControl>
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
                          <Textarea placeholder="Describe the photo..." {...field} />
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
                        <FormLabel>Primary Initiative</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an initiative" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {initiatives.map((initiative) => (
                              <SelectItem key={initiative} value={initiative}>{initiative}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initiative2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Second Initiative (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an optional second initiative" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">None</SelectItem>
                            {initiatives.map((initiative) => (
                              <SelectItem key={initiative} value={initiative}>{initiative}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadIcon className="mr-2 h-4 w-4" />}
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Browse all uploaded files. Displayed as 600x400.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map(upload => (
                <div key={upload.id} className="group relative aspect-[3/2] w-full">
                  <Image 
                    src={upload.url} 
                    alt={upload.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                    data-ai-hint="event photo"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                      <p className="text-sm font-semibold">{upload.initiative}</p>
                      <p className="text-xs text-light">{upload.description.substring(0, 50)}...</p>
                  </div>
                  {canManageUploads && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/uploads/edit/${upload.id}`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(upload.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
