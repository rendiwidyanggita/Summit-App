import { CustomerFooter } from "@/components/layout/customer-footer";
import { CustomerHeader } from "@/components/layout/customer-header";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { auth } from "@/lib/auth";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <CustomerHeader
        user={
          session?.user
            ? {
                name: session.user.name ?? null,
                email: session.user.email ?? null,
                isAdmin: session.user.isAdmin ?? false,
              }
            : null
        }
      />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <CustomerFooter />
    </div>
  );
}
