import { KnowledgeBaseSidebar } from "@/components/knowledge-base-sidebar";

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f7f8fa] dark:bg-background">
      <KnowledgeBaseSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
