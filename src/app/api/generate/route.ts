import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { template_id, style_tags = [], composition_tags = [], pose_tags = [] } = body;

  const template = getTemplateById(template_id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const disclaimer = "AI Generated · K-Star Spot · 生成对象为用户本人";

  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const Replicate = (await import("replicate")).default;
      const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

      const tagStr = [...composition_tags, ...style_tags, ...pose_tags].join(", ");
      const prompt = `${template.cloud_generation_prompt}${tagStr ? `, ${tagStr}` : ""}. The subject is the user themselves, not any celebrity or idol. Photo-realistic, high quality.`;

      const output = await replicate.run("black-forest-labs/flux-schnell", {
        input: { prompt, num_outputs: 1, aspect_ratio: "3:4" },
      });

      return NextResponse.json({
        mock: false,
        images: Array.isArray(output) ? output : [output],
        disclaimer,
        caption: `在 ${template.idol_name ?? template.group_name} 同款的${template.place_name_cn}里，感觉自己也是首尔 girl ✨ #${template.group_name} #同款打卡 #${template.district}`,
      });
    } catch (e) {
      console.error("Replicate error:", e);
    }
  }

  const mockImages = [
    "/mock-outputs/generated-1.jpg",
    "/mock-outputs/generated-2.jpg",
    "/mock-outputs/generated-3.jpg",
    "/mock-outputs/generated-4.jpg",
  ];

  return NextResponse.json({
    mock: true,
    images: mockImages,
    disclaimer,
    caption: `在 ${template.idol_name ?? template.group_name} 同款的${template.place_name_cn}里，感觉自己也是首尔 girl ✨ #${template.group_name} #同款打卡 #${template.district}`,
    note: "演示模式：展示预设效果图，配置 REPLICATE_API_TOKEN 后可生成真实图像",
  });
}
