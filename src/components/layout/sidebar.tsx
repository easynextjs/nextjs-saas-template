"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as any)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col flex-shrink-0 relative z-20",
        "bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:from-neutral-800 dark:via-neutral-850 dark:to-neutral-800",
        "border-r border-neutral-200/60 dark:border-neutral-700/30",
        "shadow-[1px_0_10px_rgba(0,0,0,0.03)] dark:shadow-[1px_0_10px_rgba(0,0,0,0.2)]",
        "px-3 py-4",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 flex flex-row md:hidden items-center justify-between px-4 py-4 relative z-30",
          "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-neutral-800 dark:to-neutral-850",
          "border-b border-neutral-200/60 dark:border-neutral-700/30",
          "shadow-sm"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer hover:text-brand transition-colors"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 z-[100] flex flex-col justify-between",
                "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800",
                "backdrop-blur-md",
                "p-8",
                className
              )}
            >
              <div
                className="absolute right-8 top-8 z-50 p-2 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 transition-colors"
                onClick={() => setOpen(!open)}
              >
                <X className="text-neutral-800 dark:text-neutral-200 cursor-pointer" />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href || "#"}
      onClick={link.onClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 relative",
        "px-2 rounded-lg transition-all duration-200",
        "hover:bg-neutral-200/60 dark:hover:bg-neutral-700/30",
        className
      )}
      {...props}
    >
      <div className="z-10 transition-transform duration-300 group-hover/sidebar:scale-110">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "text-neutral-700 dark:text-neutral-200 text-sm font-medium",
          "group-hover/sidebar:text-neutral-900 dark:group-hover/sidebar:text-white",
          "transition duration-150 whitespace-pre inline-block !p-0 !m-0",
          "relative z-10"
        )}
      >
        {link.label}
      </motion.span>

      {/* 호버 시 배경 효과 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent dark:from-brand/5 dark:to-transparent opacity-0 group-hover/sidebar:opacity-100 rounded-lg transition-opacity duration-300"
        layoutId="sidebar-highlight"
      />
    </Link>
  );
};
