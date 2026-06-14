import Link from "next/link";

const LINKS = {
  探索: [
    { href: "/map", label: "圣地巡礼地图" },
    { href: "/route", label: "路线规划" },
    { href: "/plaza", label: "同款广场" },
  ],
  功能: [
    { href: "/generate", label: "云同款生成" },
    { href: "/behind-ai", label: "Behind the AI" },
  ],
  团体: [
    { href: "/map?group=bts", label: "BTS 同款地点" },
    { href: "/map?group=blackpink", label: "BLACKPINK 同款地点" },
    { href: "/map?group=aespa", label: "aespa 同款地点" },
  ],
  关于: [
    { href: "#", label: "合规声明" },
    { href: "#", label: "用户协议" },
    { href: "#", label: "隐私政策" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-on-dark-muted">
      <div className="section-container py-16">
        {/* Logo + tagline */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-bold text-xl text-white mb-2">
            <span>★</span>
            <span>K·Star·Spot</span>
          </div>
          <p className="text-sm text-on-dark-muted">用爱豆的眼睛看世界</p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{section}</p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-on-dark-muted hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-on-dark-muted">
            © 2026 K-Star Spot · 所有内容仅供粉丝交流，不代表明星本人立场
          </p>
          <p className="text-xs text-on-dark-muted">
            AI 生成内容标注「AI Generated · K-Star Spot」· 不包含真实明星形象
          </p>
        </div>
      </div>
    </footer>
  );
}
