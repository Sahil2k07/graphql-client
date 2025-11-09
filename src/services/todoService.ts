import { gql } from "@apollo/client";
import apolloClient from "@/libs/apollo";

const TODOS_QUERY = gql`
  query GetTodos($page: Int, $limit: Int) {
    todos(page: $page, limit: $limit) {
      totalCount
      page
      limit
      todos {
        id
        title
        status
        description
        createdAt
        updatedAt
      }
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation AddTodo($title: String!, $description: String!) {
    createTodo(input: { title: $title, description: $description }) {
      id
      title
      status
    }
  }
`;

const UPDATE_TODO_MUTATION = gql`
  mutation UpdateTodo(
    $id: ID!
    $title: String!
    $description: String!
    $status: String!
  ) {
    updateTodo(
      input: {
        id: $id
        title: $title
        description: $description
        status: $status
      }
    ) {
      id
      title
      description
    }
  }
`;

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

class TodoService {
  async getTodo(variables: TodoQuery, forceNetwork = false) {
    const response = await apolloClient.query<TodoResponse>({
      query: TODOS_QUERY,
      variables,
      fetchPolicy: forceNetwork ? "network-only" : "cache-first",
    });

    return response;
  }
  async createTodo(variables: CreateTodoInput) {
    const response = await apolloClient.mutate<Todo>({
      mutation: CREATE_TODO_MUTATION,
      variables,
    });

    return response;
  }

  async updateTodo(variables: UpdateTodoInput) {
    const response = await apolloClient.mutate<Todo>({
      mutation: UPDATE_TODO_MUTATION,
      variables,
    });

    return response;
  }

  async deleteTodo(id: string) {
    const response = await apolloClient.mutate<string>({
      mutation: DELETE_TODO_MUTATION,
      variables: { id },
    });

    return response;
  }
}

export default new TodoService();
