import { NextResponse } from "next/server";
import { getRouteClusters } from "@/lib/data";

export async function GET() {
  const clusters = getRouteClusters();
  const routes = Object.entries(clusters).map(([name, templates]) => ({
    cluster_name: name,
    template_count: templates.length,
    group_ids: Array.from(new Set(templates.map((t) => t.group_id))),
    templates: templates.map((t) => ({
      template_id: t.template_id,
      place_name_cn: t.place_name_cn,
      district: t.district,
      idol_name: t.idol_name,
      group_name: t.group_name,
      group_id: t.group_id,
      lat: t.lat,
      lng: t.lng,
      photo_tips: t.photo_tips,
    })),
  }));
  return NextResponse.json({ routes });
}
