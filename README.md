This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Getting Started by Faraz's instructions-Other instructions
- Connect the database mongodb with the string.
- To run the code/start the project use **npm run dev**
- To make changes in prisma/database
{
**Apply Schema changes:**
Use this command to apply schema changes to your MongoDB database.
After making the changes use this code first.
Code to do so => **npx prisma db push**

**Prisma Generate:**
The npx prisma generate command regenerates the Prisma Client based on your schema.prisma file.
This command updates the TypeScript/JavaScript client that you use in your application to interact with the database.
After you have made changes and used the code above then use this code.
Code to do so => **npx prisma generate**
}