# Next.js Apollo GraphQL Todo App

A modern Todo application built with Next.js, Apollo Client, and GraphQL, showcasing authentication, CRUD operations, and state management in a full-stack environment.

## Features

- User authentication with NextAuth.js
- Create, read, update, and delete todos
- Mark todos as completed, pending, or cancelled
- Responsive UI with Tailwind CSS
- Real-time UI updates using Apollo GraphQL
- Client-side caching with cache invalidation
- Clean and modern UI with Lucide icons

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- GraphQL Client: Apollo Client
- Authentication: NextAuth.js (credentials provider)
- UI: Lucide-react icons
- Backend: GraphQL server (any GraphQL API)

## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```dotenv
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
NEXTAUTH_SECRET=3uek76uygj49eri
NEXTAUTH_URL=http://localhost:3000/signin
```

## Getting Started

1. Clone the repository:

```bash
git https://github.com/Sahil2k07/graphql-client.git

cd graphql-client
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm run dev
```

4. Open http://localhost:3000 in your browser.

## Usage

- Sign up or sign in using the authentication form.
- Create new todos using the "New Todo" button.
- Edit, complete, or cancel todos directly from the UI.
- Todos are fetched from the GraphQL API using Apollo Client.

## Notes

- Apollo Client caches queries by default. To bypass cache for a query, you can use fetchPolicy: 'network-only'.
- Tailwind CSS is used for all styling; the UI is responsive and mobile-friendly.
- Lucide icons provide visual indicators for todo status and actions.

## License

MIT
