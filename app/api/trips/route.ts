import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // Fetch trips for the logged-in user
        const trips = await db.collection("trips").find({ userId: session.user.id }).toArray();

        return NextResponse.json(trips);
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
        const { id, name, currency, startDate, endDate, people, expenses } = data;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const newTrip = {
            userId: session.user.id,
            id: id || Date.now(), // Use provided ID (e.g. from frontend generation) or generate one
            name,
            currency: currency || "BDT",
            startDate,
            endDate,
            people: people || [],
            expenses: expenses || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("trips").insertOne(newTrip);

        return NextResponse.json({ ...newTrip, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("Failed to create trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
