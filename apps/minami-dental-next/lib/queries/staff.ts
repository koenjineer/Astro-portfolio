import { graphqlClient } from "@/lib/graphql-client";
import { requireLocalImageSrc, type FeaturedImageNode } from "@/lib/images";

// 7人だが、管理画面で増やされても取りこぼさないよう多めに取る
const STAFF_FETCH_LIMIT = 100;

const STAFF_IMAGE_DIR = "/images/staff";

interface JobNode {
  name: string;
  slug: string;
}

interface StaffNode {
  /** 投稿タイトルに氏名を入れる運用 */
  title: string;
  slug: string;
  // ACFのテキスト欄は未入力だとnullで返る（実データにも未入力の人がいる）
  staffFields: {
    birthplace: string | null;
    hobby: string | null;
    food: string | null;
  };
  jobs: {
    nodes: JobNode[];
  };
  featuredImage: FeaturedImageNode | null;
}

interface StaffQueryResult {
  staffs: {
    nodes: StaffNode[];
  };
}

export interface StaffJob {
  name: string;
  slug: string;
}

export interface StaffMember {
  name: string;
  slug: string;
  birthplace: string | null;
  hobby: string | null;
  /** 好きな食べ物 */
  food: string | null;
  job: StaffJob;
  imageSrc: string;
}

export interface StaffGroup {
  job: StaffJob;
  members: StaffMember[];
}

// 投稿日は全件同じ日の入力順（新しい順＝最後に入れた人が先頭）で、表示順の意味を持たない。
// slugを「01」〜の連番で振ってあるので、slugの昇順を表示順とする
const STAFF_LIST_QUERY = `
  {
    staffs(first: ${STAFF_FETCH_LIMIT}, where: {orderby: {field: SLUG, order: ASC}}) {
      nodes {
        title
        slug
        staffFields {
          birthplace
          hobby
          food
        }
        jobs {
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

function toStaffMember(node: StaffNode): StaffMember {
  // 1人に1職種の運用。職種が無いとどのグループにも置けないので、ビルドを止めて気づかせる
  const [job] = node.jobs.nodes;

  if (!job) {
    throw new Error(`スタッフ（slug: ${node.slug}）に職種が設定されていません`);
  }

  return {
    name: node.title,
    slug: node.slug,
    birthplace: node.staffFields.birthplace,
    hobby: node.staffFields.hobby,
    food: node.staffFields.food,
    job: { name: job.name, slug: job.slug },
    imageSrc: requireLocalImageSrc(
      node.featuredImage,
      STAFF_IMAGE_DIR,
      `スタッフ（slug: ${node.slug}）`
    ),
  };
}

/** スタッフを表示順（slugの昇順）に全員返す。詳細ページは無いので本文は取らない */
export async function getStaffMembers(): Promise<StaffMember[]> {
  const data = await graphqlClient.request<StaffQueryResult>(STAFF_LIST_QUERY);
  const members = data.staffs.nodes.map(toStaffMember);

  if (members.length === 0) {
    throw new Error("スタッフ（staff）が1件も見つかりませんでした");
  }

  return members;
}

/**
 * 職種ごとにまとめる。グループの並びは「その職種が最初に出てくる順」。
 * slug 01〜02が歯科衛生士、03〜07が歯科助手なので「歯科衛生士 → 歯科助手」になる。
 * WordPressの職種一覧（名前順で歯科助手が先）には頼らず、slugの連番だけで並びを決める
 */
export function groupStaffByJob(members: StaffMember[]): StaffGroup[] {
  const groups = new Map<string, StaffGroup>();

  for (const member of members) {
    const group = groups.get(member.job.slug);

    if (group) {
      group.members.push(member);
    } else {
      groups.set(member.job.slug, { job: member.job, members: [member] });
    }
  }

  return [...groups.values()];
}
