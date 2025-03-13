// prisma.ts
import { PrismaClient } from '@prisma/client';

// Create a PrismaClient instance
const prisma = new PrismaClient();

// Export the PrismaClient instance for use in other parts of the app
export default prisma;
