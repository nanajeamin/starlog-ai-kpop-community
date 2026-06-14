"use client";
import { useState } from "react";
import Link from "next/link";
import { getPosts } from "@/lib/data";
import { formatCount } from "@/lib/utils";
import GroupBadge from "@/components/GroupBadge";

export default function PlazaPage() {
  const allPosts = getPosts();
  const [filterGroup, setFilterGroup] = useState("all");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = filterGroup === "all" ? allPosts : allPosts.filter((p) => p.group_id === filterGroup);

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-hairline-soft">
        <div className="section-container py-6 flex items-center justify-between">
          <div>
            <p className="text-eyebrow mb-1">社群</p>
            <h1 className="text-heading-2 text-ink">同款广场</h1>
          </div>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-charcoal transition-colors"
          >
            ✨ 发布同款
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[105px] z-20 bg-canvas/95 backdrop-blur border-b border-hairline-soft">
        <div className="section-container py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["all", "bts", "blackpink", "aespa"].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGroup(g)}
                className={`pill-tab flex-shrink-0 ${filterGroup === g ? "active" : ""}`}
              >
                {g === "all" ? "全部" : g === "bts" ? "BTS" : g === "blackpink" ? "BLACKPINK" : "aespa"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="section-container py-8">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((post) => {
            const isLiked = liked.has(post.post_id);
            const isSaved = saved.has(post.post_id);
            return (
              <div key={post.post_id} className="break-inside-avoid">
                <div className="rounded-3xl overflow-hidden border border-hairline-soft hover:shadow-card transition-shadow">
                  {/* Image */}
                  <div
                    className="w-full flex flex-col items-center justify-center relative"
                    style={{
                      backgroundColor: post.bg_color,
                      aspectRatio: post.post_id.endsWith("4") || post.post_id.endsWith("7") ? "3/5" : "3/4",
                    }}
                  >
                    <span className="text-5xl opacity-20">★</span>
                    <div className="absolute bottom-3 left-3">
                      <GroupBadge groupId={post.group_id} size="sm" />
                    </div>
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded-full">
                      AI Generated
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-canvas p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-steel flex-shrink-0">
                        {post.avatar_initial[0]}
                      </div>
                      <span className="text-xs font-medium text-ink line-clamp-1">{post.username}</span>
                    </div>
                    <p className="text-xs text-slate line-clamp-2 mb-3">{post.caption}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(post.post_id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-[#E91E8C]" : "text-stone hover:text-ink"}`}
                      >
                        {isLiked ? "❤️" : "🤍"} {formatCount(post.likes + (isLiked ? 1 : 0))}
                      </button>
                      <button
                        onClick={() => toggleSave(post.post_id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${isSaved ? "text-[#9B59B6]" : "text-stone hover:text-ink"}`}
                      >
                        {isSaved ? "⭐" : "☆"} {formatCount(post.saves + (isSaved ? 1 : 0))}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-steel text-sm">
            暂无相关同款帖子
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-6 z-30">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-white text-sm font-medium shadow-mockup hover:bg-charcoal transition-all"
        >
          ✨ 发布同款
        </Link>
      </div>
    </div>
  );
}
