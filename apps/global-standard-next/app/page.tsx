import { graphqlClient } from "@/lib/graphql-client";

interface CasesQueryResult {
  cases: {
    nodes: {
      title: string;
    }[];
  };
}

const CASES_QUERY = `
  {
    cases(first: 5) {
      nodes {
        title
      }
    }
  }
`;

export default async function Home() {
  const data = await graphqlClient.request<CasesQueryResult>(CASES_QUERY);

  return (
    <main className="flex flex-col gap-6 p-16">
      <h1 className="text-2xl font-semibold">WPGraphQL疎通確認</h1>
      <ul className="list-disc pl-6">
        {data.cases.nodes.map((node) => (
          <li key={node.title}>{node.title}</li>
        ))}
      </ul>
    </main>
  );
}
