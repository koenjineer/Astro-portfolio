import { cache } from "react";
import { graphqlClient } from "@/lib/graphql-client";
import { requireLocalImageSrc, type ImageConnection } from "@/lib/images";

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

// 並びは仮にslug昇順。日本語のslugなので、Figmaの並びを見て決め直す
const PRODUCTS_QUERY = `
  {
    products(first: ${PRODUCTS_FETCH_LIMIT}, where: {orderby: {field: SLUG, order: ASC}}) {
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
    imageSrc: requireLocalImageSrc(node.featuredImage, PRODUCTS_IMAGE_DIR, label),
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
