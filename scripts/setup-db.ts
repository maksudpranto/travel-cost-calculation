import { db } from "../lib/db";

async function setup() {
    try {
        console.log("Creating trips table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS trips (
                id BIGINT PRIMARY KEY,
                "userId" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "currency" TEXT DEFAULT 'BDT',
                "startDate" TEXT,
                "endDate" TEXT,
                "type" TEXT DEFAULT 'regular',
                "touristCount" INTEGER,
                "feePerPerson" NUMERIC,
                "status" TEXT DEFAULT 'active',
                "people" JSONB DEFAULT '[]',
                "expenses" JSONB DEFAULT '[]',
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Trips table created successfully.");
        
        // Better Auth tables will be created by Better Auth's CLI or on first run if configured,
        // but we can also define them here if needed.
        
        process.exit(0);
    } catch (error) {
        console.error("Error setting up database:", error);
        process.exit(1);
    }
}

setup();
