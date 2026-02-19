import { prisma } from "../lib/prisma";

async function main() {
  try {
    console.log("Attempting to connect to the database...");
    await prisma.$connect();
    console.log("Successfully connected to the database!");
    
    // Run a simple query to assert functionality
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Query result:", result);
    
    await prisma.$disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

main();
