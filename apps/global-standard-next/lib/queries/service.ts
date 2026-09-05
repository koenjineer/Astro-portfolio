import { graphqlClient } from "@/lib/graphql-client";

const FAQ_FIELD_COUNT = 8;

interface ServiceFaqFields {
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
  question4: string;
  answer4: string;
  question5: string;
  answer5: string;
  question6: string;
  answer6: string;
  question7: string;
  answer7: string;
  question8: string;
  answer8: string;
}

interface ServicePageQueryResult {
  pages: {
    nodes: {
      title: string;
      serviceFaqFields: ServiceFaqFields;
    }[];
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SERVICE_PAGE_QUERY = `
  {
    pages(where: {title: "サービス"}) {
      nodes {
        title
        serviceFaqFields {
          question1
          answer1
          question2
          answer2
          question3
          answer3
          question4
          answer4
          question5
          answer5
          question6
          answer6
          question7
          answer7
          question8
          answer8
        }
      }
    }
  }
`;

// WPGraphQLはACFの16フィールドをquestion1〜question8/answer1〜answer8として
// フラットに返すため、表示用に{question, answer}の配列へ変換する
function toFaqItems(fields: ServiceFaqFields): FaqItem[] {
  return Array.from({ length: FAQ_FIELD_COUNT }, (_, index) => {
    const number = index + 1;
    return {
      question: fields[`question${number}` as keyof ServiceFaqFields],
      answer: fields[`answer${number}` as keyof ServiceFaqFields],
    };
  });
}

export async function getServiceFaqItems(): Promise<FaqItem[]> {
  const data = await graphqlClient.request<ServicePageQueryResult>(
    SERVICE_PAGE_QUERY
  );
  const page = data.pages.nodes[0];

  if (!page) {
    throw new Error('固定ページ「サービス」が見つかりませんでした');
  }

  return toFaqItems(page.serviceFaqFields);
}
