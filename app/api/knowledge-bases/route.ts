import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const knowledgeBaseSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = knowledgeBaseSchema.parse(body);

    const knowledgeBase = await prisma.knowledgeBase.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ knowledgeBase }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "输入数据格式错误" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const knowledgeBases = await prisma.knowledgeBase.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        _count: {
          select: { docs: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ knowledgeBases });
  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
