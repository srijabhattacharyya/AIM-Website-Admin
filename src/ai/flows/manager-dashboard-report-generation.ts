'use server';

/**
 * @fileOverview A Genkit flow for generating project progress reports using AI.
 *
 * - generateProjectReport - A function that generates a project progress report.
 * - GenerateProjectReportInput - The input type for the generateProjectReport function.
 * - GenerateProjectReportOutput - The return type for the generateProjectReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectReportInputSchema = z.object({
  projectDescription: z.string().describe('A detailed description of the project.'),
  currentProgress: z.string().describe('A summary of the current progress of the project.'),
  futureObjectives: z.string().describe('The planned future objectives for the project.'),
});
export type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

const GenerateProjectReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive report on the project progress and future objectives.'),
});
export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

export async function generateProjectReport(input: GenerateProjectReportInput): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: {schema: GenerateProjectReportInputSchema},
  output: {schema: GenerateProjectReportOutputSchema},
  prompt: `You are an AI assistant tasked with generating project progress reports for NGO managers.

  Based on the project description, current progress, and future objectives, create a comprehensive report.

  Project Description: {{{projectDescription}}}
  Current Progress: {{{currentProgress}}}
  Future Objectives: {{{futureObjectives}}}

  Report:
`,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema,
    outputSchema: GenerateProjectReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
