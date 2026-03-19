import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { rows } = await db.query('SELECT * FROM trips WHERE "userId" = $1 ORDER BY "createdAt" DESC', [session.user.id]);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Failed to fetch trips:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { id, name, currency, startDate, endDate, people, expenses, type, touristCount, feePerPerson, status } = data;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const tripId = id || Date.now();
        const createdAt = new Date();
        const updatedAt = new Date();

        await db.query(
            `INSERT INTO trips (
                "id", "userId", "name", "currency", "startDate", "endDate", 
                "type", "touristCount", "feePerPerson", "status", "people", "expenses", 
                "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
                tripId,
                session.user.id,
                name,
                currency || "BDT",
                startDate,
                endDate,
                type || "regular",
                touristCount,
                feePerPerson,
                status || "active",
                JSON.stringify(people || []),
                JSON.stringify(expenses || []),
                createdAt,
                updatedAt
            ]
        );

        console.log("Trip created:", name, "Type:", type);

        return NextResponse.json({ 
            id: tripId, 
            userId: session.user.id,
            name,
            currency: currency || "BDT",
            startDate,
            endDate,
            type: type || "regular",
            touristCount,
            feePerPerson,
            status: status || "active",
            people: people || [],
            expenses: expenses || [],
            createdAt,
            updatedAt
        }, { status: 201 });
    } catch (error) {
        console.error("Failed to create trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
