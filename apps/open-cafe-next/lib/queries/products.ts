import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import type { ImageConnection } from "@/lib/images";
import { requireExistingLocalImageSrc } from "@/lib/images.server";

// 9件だが、管理画面で増やされても取りこぼさないよう多めに取る
const PRODUCTS_FETCH_LIMIT = 100;

const PRODUCTS_IMAGE_DIR = "/images/products";

interface ProductNode {
  title: string;
  slug: string;
  // ACFのフィールドグループのGraphQL名が `products`（投稿タイプの複数形と同じ綴り）
  products: {
    price: number | null;
  };
  featuredImage: ImageConnection | null;
}

interface ProductsQueryResult {
  products: {
    nodes: ProductNode[];
  };
}

export interface Product {
  title: string;
  /** WordPressが日本語のタイトルから自動で作ったslug。詳細ページが無いのでURLには使わない */
  slug: string;
  price: number;
  imageSrc: string;
}

// 投稿日時の古い順が、Figmaの並び（ハート型チョコレート→…→いちごマカロン）と一致する
const PRODUCTS_QUERY = `
  {
    products(first: ${PRODUCTS_FETCH_LIMIT}, where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        slug
        products {
          price
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

function toProduct(node: ProductNode): Product {
  const label = `ギフト（${node.title}）`;

  // 値段の無い商品カードは作れないので、ビルドを止めて気づかせる
  if (node.products.price === null) {
    throw new Error(`${label}に価格が設定されていません`);
  }

  return {
    title: node.title,
    slug: node.slug,
    price: node.products.price,
    // 画像がリポジトリに置かれているかまで確かめる（置き忘れたまま公開しないため）
    imageSrc: requireExistingLocalImageSrc(
      node.featuredImage,
      PRODUCTS_IMAGE_DIR,
      label
    ),
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const data = await graphqlClient.request<ProductsQueryResult>(PRODUCTS_QUERY);
  const products = data.products.nodes.map(toProduct);

  if (products.length === 0) {
    throw new Error("ギフト（product）が1件も見つかりませんでした");
  }

  return products;
});
