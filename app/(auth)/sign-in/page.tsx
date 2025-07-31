// app/(auth)/sign-in/page.tsx
// This page will handle both Google and email sign-in.



// Import signIn utility from NextAuth to trigger sign-in flows
import { signIn } from "@/auth";

// Import UI components (Card, Button, Input, etc.)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    // Center the card vertically and horizontally using flex utilities
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      {/* Container card for the form */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign-in method below.
          </CardDescription>
        </CardHeader>

        {/* Main content area for buttons and form */}
        <CardContent className="grid gap-4">

          {/* --- Google Sign-In Form --- */}
          <form
            action={async () => {
              "use server"; // tells Next.js this is a server action
              await signIn("google", { redirectTo: "/" }); // trigger Google OAuth flow
            }}
          >
            <Button type="submit" variant="outline" className="w-full">
              Sign in with Google
            </Button>
          </form>

          {/* --- Visual separator between methods --- */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* --- Email Sign-In Form (Resend) --- */}
          <form
            action={async (formData) => {
              "use server"; // mark as server action
              await signIn("resend", formData); // send magic link via Resend provider
            }}
            className="grid gap-2"
          >
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            <Button type="submit" className="w-full">
              Sign in with Email
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}