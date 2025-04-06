"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AdminPageTemplate } from "@/components/templates/admin-page";

export default function DashboardPage() {
  return (
    <AdminPageTemplate title="대시보드">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-appear opacity-0 [animation-delay:100ms]">
        {[...new Array(4)].map((_, i) => (
          <motion.div
            key={`stat-card-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={cn(
              "h-24 rounded-xl bg-white dark:bg-neutral-800",
              "border border-neutral-100/80 dark:border-neutral-700/50",
              "shadow-sm hover:shadow-md",
              "p-4 flex flex-col justify-between",
              "transition-all duration-300 hover:scale-[1.02]",
              "backdrop-blur-sm"
            )}
          >
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              통계 카드 {i + 1}
            </div>
            <div className="text-xl font-semibold text-foreground">
              {(i + 1) * 1240}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 animate-appear opacity-0 [animation-delay:300ms]">
        <div
          className={cn(
            "rounded-xl bg-white dark:bg-neutral-800",
            "border border-neutral-100/80 dark:border-neutral-700/50",
            "shadow-sm hover:shadow-md",
            "p-6 flex flex-col",
            "transition-all duration-300"
          )}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            주간 통계
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"></div>
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl bg-white dark:bg-neutral-800",
            "border border-neutral-100/80 dark:border-neutral-700/50",
            "shadow-sm hover:shadow-md",
            "p-6 flex flex-col",
            "transition-all duration-300"
          )}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            월간 요약
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-40 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </AdminPageTemplate>
  );
}
