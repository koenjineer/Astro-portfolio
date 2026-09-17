import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import type { ImageConnection } from "@/lib/images";
import { requireExistingLocalImageSrc } from "@/lib/images.server";

// ランチの写真はメニューと同じファイル（img_pasta1.webp 等）なので、メニューの置き場所を共有する
// （同じ写真を2か所に置くと、差し替えたときに片方だけ古いまま残るため。ユーザー決定）
const TOP_IMAGE_DIR = "/images/menu";

// ACFのGroup型フィールド。4枠がそれぞれ別のフィールド（a〜d）になっている
const LUNCH_SLOTS = ["a", "b", "c", "d"] as const;

type LunchSlot = (typeof LUNCH_SLOTS)[number];

interface LunchNode {
  image: ImageConnection | null;
  name: string | null;
}

interface TopQueryResult {
  page: {
    top: Record<LunchSlot, LunchNode | null>;
  } | null;
}

export interface SpecialLunch {
  name: string;
  imageSrc: string;
}

// 固定ページ「TOP」（slug: top）。タイトルで探すと同名のページが増えたときに取り違えるので、URIで1件に決める
const TOP_QUERY = `
  {
    page(id: "top", idType: URI) {
      top {
        ${LUNCH_SLOTS.map(
          (slot) => `${slot} {
          image {
            node {
              sourceUrl
            }
          }
          name
        }`
        ).join("\n        ")}
      }
    }
  }
`;

/** 今月のスペシャルランチ。ACFの4枠（a→d）を、その順のまま配列にする */
export const getSpecialLunches = cache(async (): Promise<SpecialLunch[]> => {
  const data = await graphqlClient.request<TopQueryResult>(TOP_QUERY);

  if (!data.page) {
    throw new Error("固定ページ「TOP」（slug: top）が見つかりませんでした");
  }

  const { top } = data.page;

  // 枠が1つでも空だとTOPの4列が崩れるので、ビルドを止めて気づかせる
  return LUNCH_SLOTS.map((slot) => {
    const label = `TOPのスペシャルランチ（${slot.toUpperCase()}）`;
    const lunch = top[slot];

    if (!lunch?.name) {
      throw new Error(`${label}に名前が設定されていません`);
    }

    return {
      name: lunch.name,
      // 画像がリポジトリに置かれているかまで確かめる（置き忘れたまま公開しないため）
      imageSrc: requireExistingLocalImageSrc(lunch.image, TOP_IMAGE_DIR, label),
    };
  });
});
