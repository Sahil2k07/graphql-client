"use server";

import { gql } from "@apollo/client";
import { apolloServerClient } from "@/libs/apollo";

const SIGNIN_MUTATION = gql`
  mutation SigninUser($email: String!, $password: String!) {
    signin(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

export async function signinAction(input: SigninInput) {
  const response = await apolloServerClient.mutate<SigninResponse>({
    mutation: SIGNIN_MUTATION,
    variables: input,
  });

  return response;
}
