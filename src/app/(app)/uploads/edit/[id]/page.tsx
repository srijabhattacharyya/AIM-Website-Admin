
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
import { initiatives, type Upload, type Initiative } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const UPLOADS_STORAGE_KEY = "aim-foundation-uploads";

const uploadFormSchema = z.object({
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  initiative: z.enum([...initiatives] as [string, ...string[]]),
  initiative2: z.enum([...initiatives, "__none__"] as [string, ...string[]])
    .optional()
    .transform((val) => (val === "__none__" ? undefined : val)),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export default function EditPhotoPage() {
  const router = useRouter();
  const params = useParams();
  const uploadId = params?.id as string;

  const [upload, setUpload] = useState<Upload | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      description: "",
      initiative: initiatives[0],
      initiative2: "__none__",
    },
  });

  useEffect(() => {
    if (!uploadId) return;

    const storedUploadsString = localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (storedUploadsString) {
        const storedUploads: Upload[] = JSON.parse(storedUploadsString);
        const found = storedUploads.find((p) => p.id === uploadId);
        if (found) {
            setUpload(found);
        }
    }
    setLoading(false);
  }, [uploadId]);

  useEffect(() => {
    if (upload) {
        form.reset({
            description: upload.description,
            initiative: upload.initiative,
            initiative2: upload.initiative2 || "__none__",
        });
    }
  }, [upload, form]);


  const onSubmit = (data: UploadFormValues) => {
    const storedUploadsString = localStorage.getItem(UPLOADS_STORAGE_KEY);
    const storedUploads: Upload[] = storedUploadsString ? JSON.parse(storedUploadsString) : [];

    const updatedUploads = storedUploads.map((p) =>
      p.id === uploadId
        ? {
            ...p,
            ...data,
            initiative2: data.initiative2 as Initiative | undefined,
          }
        : p
    );

    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(updatedUploads));
    window.dispatchEvent(new Event("storage"));
    router.push("/uploads");
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!upload) {
    return <p className="text-center text-destructive">Photo not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Photo Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Photo Information</CardTitle>
          <CardDescription>Modify the fields below to update the photo details.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative aspect-[3/2] w-full max-w-lg mx-auto mb-6">
                <Image
                    src={upload.url}
                    alt={upload.description}
                    fill
                    sizes="(max-width: 768px) 90vw, 33vw"
                    className="rounded-lg object-cover"
                    data-ai-hint="event photo"
                />
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormField
                control={form.control}
                name="initiative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Initiative</FormLabel>
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

              <FormField
                control={form.control}
                name="initiative2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Initiative (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "__none__"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an optional second initiative" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
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

              <Button type="submit" className="w-full">
                Update Photo
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
