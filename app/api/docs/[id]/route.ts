import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.doc.findUnique({
    where: { id },
    include: {
      knowledgeBase: {
        select: { id: true, name: true },
      },
      author: {
        select: { id: true, name: true },
      },
    },
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 添加 isAuthor 字段
  const isAuthor = session.user.id === doc.authorId;

  return NextResponse.json({ ...doc, isAuthor });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, category, knowledgeBaseId, isFavorite, isPublic } = await req.json();

  const doc = await prisma.doc.update({
    where: { id },
    data: {
      title,
      content,
      category: category || null,
      knowledgeBaseId: knowledgeBaseId || null,
      isFavorite: isFavorite ?? undefined,
      isPublic: isPublic ?? undefined,
    },
  });

  return NextResponse.json(doc);
}
