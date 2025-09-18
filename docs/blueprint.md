# **App Name**: NGO Hub

## Core Features:

- Role-Based Authentication: Secure login system with email/password and Google Sign-in via Firebase Auth. Redirects users to role-specific dashboards and manages page access based on roles (Admin, Manager, Volunteer, Intern, Donor).
- Admin Dashboard: Provides an overview of key metrics: Total Donations, Projects, Beneficiaries, Volunteers. Includes monthly donation trends and INR/USD comparison charts.
- Manager Dashboard: Displays donation statistics by project and donor, along with a project progress overview. Also provides report generation tool using a generative AI LLM to assess progress and future objectives.
- Volunteer Dashboard: Lists assigned projects, a task checklist, and access to training/media resources.
- Donor Dashboard: Shows personal donation history (INR/USD), allows receipt downloads, and provides project updates and thank-you messages.
- Donations Page: A table displays donation details (Donor Name, Email, Amount, Date, Project). Includes filtering, sorting, search, and CSV/Excel export. Accessible to Admin and Manager roles only.
- Projects Page: Lists NGO projects with descriptions, images, and status. Allows Admin and Manager roles to add, edit, and delete projects.

## Style Guidelines:

- Primary color: A muted blue (#6699CC), symbolizing trust and stability.
- Background color: Light gray (#F0F0F0), offering a clean and unobtrusive backdrop.
- Accent color: A gentle teal (#368B85) to draw attention to key interactive elements without overwhelming the user.
- Body and headline font: 'PT Sans', a humanist sans-serif font, offering both a modern aesthetic and a touch of warmth, and is suitable for both headlines and body text.
- Use a set of clear, consistent icons from a library like FontAwesome or Feather, ensuring they align with the Tailwind CSS styling for a unified look.
- Implement a responsive grid layout with Tailwind CSS, adapting to various screen sizes while maintaining a consistent structure across all dashboards and pages.
- Subtle animations and transitions using Tailwind CSS's transition utilities to enhance user experience, such as hover effects on buttons and smooth transitions between pages.