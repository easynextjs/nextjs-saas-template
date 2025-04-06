"use client";

import { motion } from "framer-motion";
import { DashboardSummary } from "../schema";
import { cn } from "@/lib/utils";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  index: number;
};

const StatCard = ({ title, value, icon, className, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className={cn(
      "h-24 rounded-xl bg-white dark:bg-neutral-800",
      "border border-neutral-100/80 dark:border-neutral-700/50",
      "shadow-sm hover:shadow-md",
      "p-4 flex justify-between",
      "transition-all duration-300 hover:scale-[1.02]",
      "backdrop-blur-sm",
      className
    )}
  >
    <div className="flex flex-col justify-between">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {title}
      </div>
      <div className="text-xl font-semibold text-foreground">{value}</div>
    </div>
    <div className="flex items-center">
      <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
        {icon}
      </div>
    </div>
  </motion.div>
);

type DashboardStatsProps = {
  summary: DashboardSummary;
};

export function DashboardStats({ summary }: DashboardStatsProps) {
  const { stats } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-appear opacity-0 [animation-delay:100ms]">
      <StatCard
        title="전체 제품"
        value={stats.totalProducts}
        icon={<Package className="h-5 w-5" />}
        index={0}
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
      />
      <StatCard
        title="판매 중"
        value={stats.saleProducts}
        icon={<ShoppingCart className="h-5 w-5" />}
        index={1}
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
      />
      <StatCard
        title="품절"
        value={stats.soldoutProducts}
        icon={<AlertTriangle className="h-5 w-5" />}
        index={2}
        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
      />
      <StatCard
        title="팀원"
        value={stats.totalMembers}
        icon={<Users className="h-5 w-5" />}
        index={3}
        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
      />
    </div>
  );
}
