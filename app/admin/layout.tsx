import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminMobileWrapper from "@/components/admin/AdminMobileWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <AdminMobileWrapper user={session.user}>{children}</AdminMobileWrapper>;
}
