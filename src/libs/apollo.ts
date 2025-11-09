import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/configs/authOptions";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = new SetContextLink(async (prevContext, _) => {
  const session = await getSession();

  const token = session?.token ? `Bearer ${session.token}` : null;

  return {
    headers: {
      ...prevContext.headers,
      Authorization: token,
    },
  };
});

const authServerLink = new SetContextLink(async (prevContext, _) => {
  const session = await getServerSession(authOptions);

  const token = session?.token ? `Bearer ${session?.token}` : null;

  return {
    headers: {
      ...prevContext.headers,
      Authorization: token,
    },
  };
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const apolloServerClient = new ApolloClient({
  link: ApolloLink.from([authServerLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
