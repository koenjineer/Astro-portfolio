import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import type { ImageConnection } from "@/lib/images";
import { requireExistingLocalImageSrc } from "@/lib/images.server";
import { SHOP_TITLE_ORDER } from "@/lib/site";

// 3店舗だが、管理画面で増やされても取りこぼさないよう多めに取る
const SHOPS_FETCH_LIMIT = 100;

const SHOP_IMAGE_DIR = "/images/shop";

// ACFの住所・営業時間は、複数行を改行（\r\n）区切りの1つの文字列で返す
const LINE_BREAK = /\r?\n/;

interface ShopNode {
  title: string;
  slug: string;
  // ACFのテキスト欄は未入力だとnullで返る
  shopFields: {
    address: string | null;
    tel: string | null;
    email: string | null;
    time: string | null;
    holiday: string | null;
    count: string | null;
  };
  featuredImage: ImageConnection | null;
}

interface ShopsQueryResult {
  shops: {
    nodes: ShopNode[];
  };
}

export interface Shop {
  title: string;
  /** WordPressが日本語のタイトルから自動で作ったslug。URLには使わない */
  slug: string;
  /** 1行目が郵便番号、2行目が住所 */
  addressLines: string[];
  tel: string | null;
  email: string | null;
  /** 1行目が営業時間、2行目がラストオーダー */
  timeLines: string[];
  holiday: string | null;
  /** 席数（例：テーブル4席 ／ カウンター10席） */
  seats: string | null;
  /** 店内の写真。WordPress側のファイル名が map_* なのは登録時の名残で、中身は地図ではない */
  imageSrc: string;
}

// 表示順は取得後に SHOP_TITLE_ORDER で決める。ここは「管理画面で増えた店がどこに入るか」を
// 安定させるための下ごしらえで、日本語のslug順よりは登録順のほうが読み手に想像がつく
const SHOPS_QUERY = `
  {
    shops(first: ${SHOPS_FETCH_LIMIT}, where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        slug
        shopFields {
          address
          tel
          email
          time
          holiday
          count
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

function toLines(text: string | null): string[] {
  return text ? text.split(LINE_BREAK).filter((line) => line !== "") : [];
}

function toShop(node: ShopNode): Shop {
  const fields = node.shopFields;

  return {
    title: node.title,
    slug: node.slug,
    addressLines: toLines(fields.address),
    tel: fields.tel,
    email: fields.email,
    timeLines: toLines(fields.time),
    holiday: fields.holiday,
    seats: fields.count,
    imageSrc: requireExistingLocalImageSrc(
      node.featuredImage,
      SHOP_IMAGE_DIR,
      `店舗（${node.title}）`
    ),
  };
}

/** Figmaに描かれていない店名は末尾に回す。管理画面で店が増えてもビルドは通し、並びだけ後ろにする */
function toDisplayOrder(shop: Shop): number {
  const index = SHOP_TITLE_ORDER.indexOf(shop.title);

  return index === -1 ? SHOP_TITLE_ORDER.length : index;
}

export const getShops = cache(async (): Promise<Shop[]> => {
  const data = await graphqlClient.request<ShopsQueryResult>(SHOPS_QUERY);
  // sortは安定なので、SHOP_TITLE_ORDER に無い店どうしは取得した順（登録順）のまま後ろに並ぶ
  const shops = data.shops.nodes
    .map(toShop)
    .sort((a, b) => toDisplayOrder(a) - toDisplayOrder(b));

  if (shops.length === 0) {
    throw new Error("店舗（shop）が1件も見つかりませんでした");
  }

  return shops;
});
