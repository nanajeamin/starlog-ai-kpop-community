import templatesData from "@/data/templates.json";
import groupsData from "@/data/groups.json";
import postsData from "@/data/posts.json";

export type Template = (typeof templatesData)[0];
export type Group = (typeof groupsData)[0];
export type Post = (typeof postsData)[0];

export function getTemplates(groupId?: string, limit?: number): Template[] {
  let result = templatesData as Template[];
  if (groupId && groupId !== "all") {
    result = result.filter((t) => t.group_id === groupId);
  }
  if (limit) result = result.slice(0, limit);
  return result;
}

export function getTemplateById(id: string): Template | undefined {
  return (templatesData as Template[]).find((t) => t.template_id === id);
}

export function getGroups(): Group[] {
  return groupsData as Group[];
}

export function getTopTemplates(n = 4): Template[] {
  return [...(templatesData as Template[])]
    .sort((a, b) => b.priority_scores.overall_priority - a.priority_scores.overall_priority)
    .slice(0, n);
}

export function getPosts(groupId?: string): Post[] {
  let result = postsData as Post[];
  if (groupId && groupId !== "all") {
    result = result.filter((p) => p.group_id === groupId);
  }
  return result;
}

export function getRouteClusters(): Record<string, Template[]> {
  const clusters: Record<string, Template[]> = {};
  for (const t of templatesData as Template[]) {
    const cluster = t.route_cluster;
    if (!clusters[cluster]) clusters[cluster] = [];
    clusters[cluster].push(t);
  }
  return clusters;
}
