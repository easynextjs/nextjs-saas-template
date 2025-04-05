"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/layout/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";

export default function SidebarDemo() {
  const links = [
    {
      label: "대시보드",
      href: "#",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "프로필",
      href: "#",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "설정",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "로그아웃",
      href: "#",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full h-screen overflow-hidden",
        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "최고 디자이너",
                href: "#",
                icon: (
                  <Image
                    src="https://picsum.photos/200"
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        디자인 랩스
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
          대시보드
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...new Array(4)].map((_, i) => (
            <div
              key={`stat-card-${i}`}
              className="h-24 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                통계 카드 {i + 1}
              </div>
              <div className="text-xl font-semibold">{(i + 1) * 1240}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">주간 통계</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"></div>
            </div>
          </div>
          <div className="rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">월간 요약</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-40 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
