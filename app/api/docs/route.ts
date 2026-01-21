import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const docSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  category: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = docSchema.parse(body);

    const slug = validatedData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .substring(0, 50) + "-" + Date.now();

    const doc = await prisma.doc.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        category: validatedData.category,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ doc }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "输入数据格式错误" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "创建失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const docs = await prisma.doc.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ docs });
  } catch (error) {
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    );
  }
}
