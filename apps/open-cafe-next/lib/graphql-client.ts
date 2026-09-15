import { GraphQLClient } from "graphql-request";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WORDPRESS_API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not set");
}

export const graphqlClient = new GraphQLClient(WORDPRESS_API_URL);
