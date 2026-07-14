import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color,
}: DashboardCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-violet-500 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className={`${color} p-3 rounded-xl`}>
          <Icon size={28} className="text-white" />
        </div>

      </div>

    </div>
  );
}