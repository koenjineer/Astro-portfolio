import { graphqlClient } from "@/lib/graphql-client";
import { requireLocalImageSrc, type FeaturedImageNode } from "@/lib/images";

// 8件だが、管理画面で増やされても取りこぼさないよう多めに取る
const MEDICAL_FETCH_LIMIT = 100;

const MEDICAL_IMAGE_DIR = "/images/medical";

interface MedicalTypeNode {
  name: string;
  slug: string;
}

interface MedicalNode {
  title: string;
  slug: string;
  // ACFのテキスト欄は未入力だとnullで返る
  medicalFields: {
    lead: string | null;
    description: string | null;
  };
  medicalTypes: {
    nodes: MedicalTypeNode[];
  };
  featuredImage: FeaturedImageNode | null;
}

interface MedicalQueryResult {
  medicals: {
    nodes: MedicalNode[];
  };
}

export interface MedicalType {
  name: string;
  slug: string;
}

export interface Medical {
  title: string;
  slug: string;
  /** 「歯並びが気になる」のような、診療名に添える一言 */
  lead: string | null;
  description: string | null;
  type: MedicalType;
  imageSrc: string;
}

export interface MedicalGroup {
  type: MedicalType;
  medicals: Medical[];
}

// 投稿日は全件同じ日の入力順（新しい順＝レーザー治療が先頭）で、表示順の意味を持たない。
// slugを「01」〜の連番で振ってあるので、slugの昇順を表示順とする
const MEDICAL_LIST_QUERY = `
  {
    medicals(first: ${MEDICAL_FETCH_LIMIT}, where: {orderby: {field: SLUG, order: ASC}}) {
      nodes {
        title
        slug
        medicalFields {
          lead
          description
        }
        medicalTypes {
          nodes {
            name
            slug
          }
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

function toMedical(node: MedicalNode): Medical {
  // 1診療に1タイプの運用。タイプが無いとどのグループにも置けないので、ビルドを止めて気づかせる
  const [type] = node.medicalTypes.nodes;

  if (!type) {
    throw new Error(`診療案内（slug: ${node.slug}）に診療タイプが設定されていません`);
  }

  return {
    title: node.title,
    slug: node.slug,
    lead: node.medicalFields.lead,
    description: node.medicalFields.description,
    type: { name: type.name, slug: type.slug },
    imageSrc: requireLocalImageSrc(
      node.featuredImage,
      MEDICAL_IMAGE_DIR,
      `診療案内（slug: ${node.slug}）`
    ),
  };
}

/** 診療案内を表示順（slugの昇順）に全件返す。詳細ページは無いので本文は取らない */
export async function getMedicals(): Promise<Medical[]> {
  const data = await graphqlClient.request<MedicalQueryResult>(MEDICAL_LIST_QUERY);
  const medicals = data.medicals.nodes.map(toMedical);

  if (medicals.length === 0) {
    throw new Error("診療案内（medical）が1件も見つかりませんでした");
  }

  return medicals;
}

/**
 * 診療タイプごとにまとめる。グループの並びは「そのタイプが最初に出てくる順」。
 * slug 01〜03が一般診療、04〜08が特殊診療なので「一般診療 → 特殊診療」になる。
 * WordPressのタイプ一覧（名前順）には頼らず、slugの連番だけで並びを決められるようにする
 */
export function groupMedicalsByType(medicals: Medical[]): MedicalGroup[] {
  const groups = new Map<string, MedicalGroup>();

  for (const medical of medicals) {
    const group = groups.get(medical.type.slug);

    if (group) {
      group.medicals.push(medical);
    } else {
      groups.set(medical.type.slug, { type: medical.type, medicals: [medical] });
    }
  }

  return [...groups.values()];
}
