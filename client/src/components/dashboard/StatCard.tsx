import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  change: {
    value: string | number;
    isPositive: boolean;
    label: string;
  };
  border: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  change,
  border
}: StatCardProps) => {
  return (
    <Card className={`p-4 border-l-4 ${border}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-neutral-800 mt-1">{value}</p>
        </div>
        <div className={`p-2 ${iconBgColor} bg-opacity-10 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      <div className="flex items-center mt-3">
        <span className={`${change.isPositive ? 'text-success' : 'text-error'} text-sm font-medium`}>
          {change.isPositive ? '+' : ''}{change.value}
        </span>
        <span className="text-neutral-500 text-sm ml-1">{change.label}</span>
      </div>
    </Card>
  );
};

export default StatCard;
