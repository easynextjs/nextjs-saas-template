"use client";

import { LayoutDashboard, LogOut, Settings, UserCog } from "lucide-react";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../layout/sidebar";
import { Glow } from "../ui/glow";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next/client";
import { COOKIE_NAME } from "@/constants/cookie-name";
import { useRouter } from "next/navigation";
import { useUser, useWorkspace } from "@/providers/dashboard";

export function DashboardTemplate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const workspace = useWorkspace();
  const user = useUser();

  const links = [
    {
      label: "대시보드",
      href: `/dashboard/${workspace.id}`,
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "프로필",
      href: `/dashboard/${workspace.id}/profile`,
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "설정",
      href: `/dashboard/${workspace.id}/settings`,
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "로그아웃",
      href: "/",
      onClick: () => {
        deleteCookie(COOKIE_NAME.ACCESS_TOKEN);
        router.push("/auth/login");
      },
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full h-screen overflow-hidden relative",
        "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-100/70 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900/90"
      )}
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="above"
          className="animate-appear-zoom opacity-0 [animation-delay:200ms]"
        />
      </div>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-hidden">
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
                label: user.name,
                href: "#",
                icon: (
                  <div className="border-2 border-brand/30 rounded-full p-[2px] shadow-sm">
                    <Image
                      src="https://picsum.photos/200"
                      className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

export const Logo = () => {
  const workspace = useWorkspace();

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-brand to-brand/80 dark:from-brand/90 dark:to-brand/70 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 shadow-md" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        {workspace.name}
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
      <div className="h-6 w-6 bg-gradient-to-br from-brand to-brand/80 dark:from-brand/90 dark:to-brand/70 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 shadow-md" />
    </Link>
  );
};
