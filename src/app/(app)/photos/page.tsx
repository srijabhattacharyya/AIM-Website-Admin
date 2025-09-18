import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockPhotos } from "@/lib/data";
import { Upload } from "lucide-react";
import Image from "next/image";

export default function PhotosPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Photo Library</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Browse all uploaded photos.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockPhotos.map(photo => (
                <div key={photo.id} className="aspect-w-1 aspect-h-1">
                  <Image 
                    src={photo.url} 
                    alt={photo.name} 
                    width={200} 
                    height={200} 
                    className="rounded-lg object-cover"
                    data-ai-hint="event photo"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription>Add new photos to the gallery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="photo-file">Select File</Label>
                <Input id="photo-file" type="file" />
              </div>
              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
