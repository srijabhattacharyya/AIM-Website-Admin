import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUploads } from "@/lib/data";
import { Upload as UploadIcon, Trash2 } from "lucide-react";
import Image from "next/image";

export default function UploadsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">File Uploads</h1>
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
