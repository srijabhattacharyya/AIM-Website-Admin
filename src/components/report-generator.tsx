"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateProjectReport } from '@/ai/flows/manager-dashboard-report-generation';
import { Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const reportSchema = z.object({
  projectDescription: z.string().min(20, 'Please provide a more detailed project description.'),
  currentProgress: z.string().min(20, 'Please summarize the current progress in more detail.'),
  futureObjectives: z.string().min(20, 'Please outline the future objectives more clearly.'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      projectDescription: '',
      currentProgress: '',
      futureObjectives: '',
    },
  });

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateProjectReport(data);
      setReport(result.report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate the report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 /> Generate Report</CardTitle>
        <CardDescription>Use AI to generate a project progress report.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project's goals and scope." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentProgress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Progress</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Summarize what has been achieved so far." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="futureObjectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Future Objectives</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Outline the next steps and long-term goals." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </form>
        </Form>
      </CardContent>
      {(isLoading || report) && (
        <CardFooter>
            {report && (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Generated Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-48">
                            <p className="text-sm whitespace-pre-wrap">{report}</p>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </CardFooter>
      )}
    </Card>
  );
}
