import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/data";
import crypto from "crypto";

function generateKlingJWT(): string {
  const accessKey = process.env.KLING_ACCESS_KEY!;
  const secretKey = process.env.KLING_SECRET_KEY!;
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5,
  })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

async function pollKlingTask(taskId: string, token: string): Promise<string[]> {
  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`https://api.klingai.com/v1/images/generations/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.data?.task_status === "succeed") {
      const images: string[] = data.data.task_result?.images?.map((img: { url: string }) => img.url) ?? [];
      if (images.length > 0) return images;
    }
    if (data?.data?.task_status === "failed") {
      throw new Error("Kling task failed: " + data.data.task_status_msg);
    }
  }
  throw new Error("Kling generation timed out");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { template_id, style_tags = [], composition_tags = [], pose_tags = [], user_image_url } = body;

  const template = getTemplateById(template_id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const disclaimer = "AI Generated · K-Star Spot · 生成对象为用户本人";
  const caption = `在 ${template.idol_name ?? template.group_name} 同款的${template.place_name_cn}里，感觉自己也是首尔 girl ✨ #${template.group_name} #同款打卡 #${template.district}`;

  if (process.env.KLING_ACCESS_KEY && process.env.KLING_SECRET_KEY) {
    try {
      const token = generateKlingJWT();
      const tagStr = [...composition_tags, ...style_tags, ...pose_tags].join(", ");
      const prompt = `${template.cloud_generation_prompt}${tagStr ? `, ${tagStr}` : ""}. The subject is the user themselves. Photo-realistic, high quality, Korean aesthetic.`;

      const body: Record<string, unknown> = {
        model_name: "kling-v1",
        prompt,
        negative_prompt: "celebrity, idol, famous person, low quality, blurry",
        n: 4,
        aspect_ratio: "3:4",
      };

      // If user uploaded a photo, use it as image reference
      if (user_image_url) {
        body.image_reference = {
          image: user_image_url,
          image_reference_type: "subject",
        };
      }

      const createRes = await fetch("https://api.klingai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const createData = await createRes.json();
      if (!createData?.data?.task_id) {
        throw new Error("Failed to create Kling task: " + JSON.stringify(createData));
      }

      // Refresh token for polling (JWT might be same duration)
      const images = await pollKlingTask(createData.data.task_id, token);

      return NextResponse.json({ mock: false, images, disclaimer, caption });
    } catch (e) {
      console.error("Kling error:", e);
      // Fall through to mock
    }
  }

  // Mock fallback
  return NextResponse.json({
    mock: true,
    images: ["/mock-outputs/generated-1.jpg"],
    disclaimer,
    caption,
    note: "演示模式",
  });
}
