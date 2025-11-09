import { gql } from "@apollo/client";
import apolloClient from "@/libs/apollo";

const SIGNUP_MUTATION = gql`
  mutation SignupUser(
    $email: String!
    $userName: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      input: {
        email: $email
        userName: $userName
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      token
      user {
        id
        email
        userName
      }
    }
  }
`;

class AuthService {
  async signup(variables: SignupInput) {
    const response = await apolloClient.mutate<string>({
      mutation: SIGNUP_MUTATION,
      variables,
    });

    return response;
  }
}

export default new AuthService();
