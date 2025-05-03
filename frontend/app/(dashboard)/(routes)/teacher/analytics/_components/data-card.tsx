import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { IconType } from "react-icons"; // Using react-icons for better icon handling

interface DataCardProps {
  value: number;
  label: string;
  icon: IconType;
  variant?: "default" | "success" | "destructive" | "warning";
}

export const DataCard = ({
  value,
  label,
  icon: Icon,
  variant = "default",
}: DataCardProps) => {
  // Variant colors
  const variantClasses = {
    default: "text-blue-600",
    success: "text-green-600",
    destructive: "text-red-600",
    warning: "text-yellow-600",
  };

  const valueClasses = {
    default: "text-foreground",
    success: "text-green-600",
    destructive: "text-red-600",
    warning: "text-yellow-600",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={`h-4 w-4 ${variantClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClasses[variant]}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {variant === "success" && "↑ Increased"}
          {variant === "destructive" && "↓ Decreased"}
          {variant === "warning" && "⚠ Needs attention"}
        </p>
      </CardContent>
    </Card>
  );
};
