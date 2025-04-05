import { DashboardTemplate } from "@/components/templates/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
