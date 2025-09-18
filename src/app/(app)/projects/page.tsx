import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function ProjectsPage() {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'default';
      case 'Completed': return 'secondary';
      case 'Planning': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Projects</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                  <Image src={project.imageUrl} alt={project.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="community project" />
              </div>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter>
              <Badge variant={getBadgeVariant(project.status) as any}>{project.status}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
