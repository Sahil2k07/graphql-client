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
  credentials: "include",
});

const authLink = new SetContextLink(async (prevContext, _) => {
  const session = await getSession();

  const cookie = session?.token
    ? `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${session.token}`
    : null;

  return {
    headers: {
      ...prevContext.headers,
      Cookie: cookie,
    },
  };
});

const authServerLink = new SetContextLink(async (prevContext, _) => {
  const session = await getServerSession(authOptions);

  const cookie = session?.token
    ? `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${session?.token}`
    : null;

  return {
    headers: {
      ...prevContext.headers,
      Cookie: cookie,
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
