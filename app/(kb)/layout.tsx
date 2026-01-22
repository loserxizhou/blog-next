import { auth } from "@/lib/auth";
import { KnowledgeBaseSidebar } from "@/components/knowledge-base-sidebar";

export default async function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-[#f7f8fa] dark:bg-background">
      <KnowledgeBaseSidebar user={session?.user} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
