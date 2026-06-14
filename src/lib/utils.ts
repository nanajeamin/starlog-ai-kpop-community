import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export const GROUP_CONFIG = {
  bts: { name: "BTS", color: "#9B59B6", bg: "#ede8f8", text: "#6B3FA0" },
  blackpink: { name: "BLACKPINK", color: "#E91E8C", bg: "#fde0f0", text: "#B01569" },
  aespa: { name: "aespa", color: "#00B4D8", bg: "#c3faf5", text: "#007A92" },
} as const;

export const PLACE_TYPE_LABELS: Record<string, string> = {
  cafe_restaurant: "咖啡厅/餐厅",
  agency_building: "公司楼",
  popup_store: "快闪店",
  mv_variety_location: "MV/综艺取景地",
  concert_venue: "演唱会场馆",
  support_ad: "应援广告",
  photo_booth: "拍贴机",
  merch_store: "周边商店",
  idol_footprint: "偶像足迹",
  broadcast_station: "电视台",
  landmark_street: "地标街区",
};
