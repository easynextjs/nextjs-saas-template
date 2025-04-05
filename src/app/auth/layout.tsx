import { Footer } from "@/components/layout/footer";
import { Header1 } from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header1 />
      {children}
      <Footer />
    </div>
  );
}
