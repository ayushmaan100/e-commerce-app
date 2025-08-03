// 📦 Import the auth method to retrieve user session
import { auth } from "@/auth";

// 🧱 Import UI components for the card layout
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

// 🚦 Used to redirect unauthenticated users
import { redirect } from "next/navigation";

// 🧑‍💼 Profile page component
export default async function ProfilePage() {
  // 🔐 Retrieve the current session
  const session = await auth();
  const user = session?.user;

  // 🚫 If user is not authenticated, redirect to sign-in
  if (!user) {
    redirect("/api/auth/signin");
  }

  // ✅ Authenticated view: show user info
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>

        {/* 💬 Display user details */}
        <CardContent className="space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}