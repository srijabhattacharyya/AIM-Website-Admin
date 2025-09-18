import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>NGO Details</CardTitle>
          <CardDescription>Update your organization's information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ngo-name">NGO Name</Label>
            <Input id="ngo-name" defaultValue="NGO Hub Foundation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" defaultValue="contact@ngohub.org" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" />
            <p className="text-xs text-muted-foreground">Upload a new logo file.</p>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
