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
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const docs = await prisma.doc.findMany({
      where: {
        knowledgeBaseId: id,
        authorId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ docs });
  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
