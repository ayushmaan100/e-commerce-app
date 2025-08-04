//  display metrics such as total sales, users, orders, etc., in your admin dashboard:

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

// Props type for the AnalyticsCard component
type AnalyticsCardProps = {
  title: string;            // The title of the metric (e.g., "Total Orders")
  value: string;            // The main value (e.g., "₹120K")
  icon: LucideIcon;         // Lucide icon to display (passed as a component)
  description?: string;     // Optional small description or subtext
};

// Reusable component to show a metric card
export function AnalyticsCard({ title, value, icon: Icon, description }: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}