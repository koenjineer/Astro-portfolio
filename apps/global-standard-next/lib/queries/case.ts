import { COURSES } from "@/lib/courses";
import { graphqlClient } from "@/lib/graphql-client";

// 9社しかないCPTだが、管理画面で増やされても取りこぼさないよう多めに取る
const CASE_FETCH_LIMIT = 100;

interface CaseFields {
  businessField: string;
  before: string;
  reason: string;
  after: string;
}

interface CaseNode {
  title: string;
  slug: string;
  caseFields: CaseFields;
  businessCourses: {
    nodes: { slug: string }[];
  };
}

interface CasesQueryResult {
  cases: {
    nodes: CaseNode[];
  };
}

export interface CaseItem {
  companyName: string;
  /** ロゴ画像のファイル名に使う（/images/case/logo-{slug}.webp） */
  slug: string;
  businessField: string;
  /** ACF before → 「研修の目的」 */
  purpose: string;
  /** ACF reason → 「選んだ理由」 */
  reason: string;
  /** ACF after → 「導入後の成果・効果」 */
  outcome: string;
}

export interface CaseListItem extends CaseItem {
  /** この事例が属する研修コース。コース別にまとめない一覧で1件ずつが持つ */
  courseTitle: string;
  courseSlug: string;
}

export interface CaseCourseGroup {
  slug: string;
  title: string;
  englishName: string;
  cases: CaseItem[];
}

// WPGraphQLの既定の並びは投稿日の降順。Figmaのカードの並び（AAA→…→III）は
// 投稿日の昇順なので、ここで明示的にASCを指定する
export const CASE_LIST_QUERY = `
  {
    cases(first: ${CASE_FETCH_LIMIT}, where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        slug
        caseFields {
          businessField
          before
          reason
          after
        }
        businessCourses {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

function toCaseItem(node: CaseNode): CaseItem {
  return {
    companyName: node.title,
    slug: node.slug,
    businessField: node.caseFields.businessField,
    purpose: node.caseFields.before,
    reason: node.caseFields.reason,
    outcome: node.caseFields.after,
  };
}

/** 事例の取得はここ1か所。コース別（/case）と平ら（トップページ）で同じ結果を組み替える */
async function fetchCaseNodes(): Promise<CaseNode[]> {
  const data = await graphqlClient.request<CasesQueryResult>(CASE_LIST_QUERY);

  if (data.cases.nodes.length === 0) {
    throw new Error("導入事例（case）が1件も見つかりませんでした");
  }

  return data.cases.nodes;
}

/** WordPressのタクソノミーが複数付いていても、表示に使うコースは先頭の1つに絞る */
function findCourse(node: CaseNode) {
  return COURSES.find((course) =>
    node.businessCourses.nodes.some(
      (businessCourse) => businessCourse.slug === course.slug
    )
  );
}

/**
 * 導入事例を投稿日の昇順（Figmaのカード順 AAA→III）で平らに返す。
 * トップページは先頭6件だけを出す。仕様書は「最新の6件」だが9件とも投稿日が同じで
 * 新旧を決められないため、Figmaのモックおよび /case の並びと揃えて先頭から取る。
 */
export async function getCaseItems(): Promise<CaseListItem[]> {
  const caseNodes = await fetchCaseNodes();

  return caseNodes.flatMap((node) => {
    const course = findCourse(node);

    return course
      ? [{ ...toCaseItem(node), courseTitle: course.title, courseSlug: course.slug }]
      : [];
  });
}

/**
 * 導入事例をコース別にまとめて返す。
 * 並び順はWordPressの返却順ではなくlib/courses.tsのCOURSESの順に固定する。
 * 事例が0件のコースは返さない。カテゴリーボタンもセクションもこの戻り値から
 * 作るので、飛び先の無いアンカーが生まれないようにするため。
 */
export async function getCaseCourseGroups(): Promise<CaseCourseGroup[]> {
  const caseNodes = await fetchCaseNodes();

  const groups = COURSES.map((course) => ({
    slug: course.slug,
    title: course.title,
    englishName: course.englishName,
    cases: caseNodes
      .filter((node) =>
        node.businessCourses.nodes.some(
          (businessCourse) => businessCourse.slug === course.slug
        )
      )
      .map(toCaseItem),
  })).filter((group) => group.cases.length > 0);

  if (groups.length === 0) {
    throw new Error("導入事例（case）にコースが1つも紐づいていませんでした");
  }

  return groups;
}
