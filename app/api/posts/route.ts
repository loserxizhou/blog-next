import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const slug = validatedData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .substring(0, 50) + "-" + Date.now();

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        published: validatedData.published,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
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

    const posts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    );
  }
}
