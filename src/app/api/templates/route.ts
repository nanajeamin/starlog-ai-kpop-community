import { NextRequest, NextResponse } from "next/server";
import { getTemplates } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const group = searchParams.get("group") ?? undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
  const templates = getTemplates(group, limit);
  return NextResponse.json({ templates, total: templates.length });
}
