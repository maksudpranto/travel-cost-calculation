import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tripId = parseInt(params.id);
        if (isNaN(tripId)) {
            return NextResponse.json({ error: "Invalid Trip ID" }, { status: 400 });
        }

        const data = await req.json();
        // Destructure to prevent overwriting protected fields like _id or userId if passed malicious data
        const { name, currency, startDate, endDate, people, expenses } = data;

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("trips").updateOne(
            { id: tripId, userId: session.user.id },
            {
                $set: {
                    name,
                    currency,
                    startDate,
                    endDate,
                    people,
                    expenses,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tripId = parseInt(params.id);
        if (isNaN(tripId)) {
            return NextResponse.json({ error: "Invalid Trip ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("trips").deleteOne({
            id: tripId,
            userId: session.user.id,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
