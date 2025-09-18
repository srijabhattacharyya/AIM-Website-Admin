import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { mockTasks } from "@/lib/data";
import { FileUp, ListChecks } from "lucide-react";

export default function InternDashboard() {
  const internTasks = mockTasks.slice(1, 4);
  const weeklyProgress = 60;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks/> Assigned Tasks</CardTitle>
          <CardDescription>Your tasks for this week.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {internTasks.map(task => (
            <div key={task.id} className={`p-2 rounded ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
              {task.title}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your overall task completion progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Progress value={weeklyProgress} className="w-full" />
            <p className="text-right text-sm text-muted-foreground">{weeklyProgress}% complete</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileUp/> Upload Report</CardTitle>
          <CardDescription>Submit your weekly reports or other files here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="report-file">Select File</Label>
            <Input id="report-file" type="file" />
            <Button className="mt-2">Upload File</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
