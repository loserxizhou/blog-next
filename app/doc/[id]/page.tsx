import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { DocViewer } from "@/components/doc-viewer";

export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const doc = await prisma.doc.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true },
      },
      knowledgeBase: {
        select: { name: true },
      },
    },
  });

  if (!doc) {
    notFound();
  }

  const isAuthor = session?.user?.id === doc.authorId;

  return <DocViewer doc={doc} isAuthor={isAuthor} />;
}
