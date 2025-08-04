import Link from "next/link";
import { Package } from "lucide-react"; // Icon for branding
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar: Hidden on small screens, visible on md+ */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Brand/Logo section */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span className="">ACME Inc.</span>
            </Link>
          </div>

          {/* Sidebar navigation */}
          <div className="flex-1">
            <AdminSidebar />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col">
        {/* You can add a header for mobile navigation later */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}