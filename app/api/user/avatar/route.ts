import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase 未配置，请联系管理员" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 });
    }

    // 验证文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 2MB" }, { status: 400 });
    }

    // 验证文件扩展名（白名单）
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json({ error: "只支持 JPG、PNG、GIF、WebP 格式" }, { status: 400 });
    }

    // 验证文件类型（检查 magic bytes）
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const isValidImage =
      (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) || // JPEG
      (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) || // PNG
      (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) || // GIF
      (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50); // WebP

    if (!isValidImage) {
      return NextResponse.json({ error: "文件内容不是有效的图片" }, { status: 400 });
    }

    // 生成唯一文件名
    const filename = `${session.user.id}-${Date.now()}.${ext}`;
    const filepath = `avatars/${filename}`;

    // 上传到 Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filepath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "上传失败" }, { status: 500 });
    }

    // 获取公开 URL
    const { data } = supabaseAdmin.storage.from("uploads").getPublicUrl(filepath);
    const imageUrl = data.publicUrl;

    // 更新数据库
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
