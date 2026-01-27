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
        const { name, currency, startDate, endDate, people, expenses, type, touristCount, feePerPerson, status } = data;

        const client = await clientPromise;
        const db = client.db();

        const updateDoc: any = { updatedAt: new Date() };

        if (name !== undefined) updateDoc.name = name;
        if (currency !== undefined) updateDoc.currency = currency;
        if (startDate !== undefined) updateDoc.startDate = startDate;
        if (endDate !== undefined) updateDoc.endDate = endDate;
        if (people !== undefined) updateDoc.people = people;
        if (expenses !== undefined) updateDoc.expenses = expenses;
        if (type !== undefined) updateDoc.type = type;
        if (touristCount !== undefined) updateDoc.touristCount = touristCount;
        if (feePerPerson !== undefined) updateDoc.feePerPerson = feePerPerson;
        if (status !== undefined) updateDoc.status = status;

        const result = await db.collection("trips").updateOne(
            { id: tripId, userId: session.user.id },
            { $set: updateDoc }
        );

        console.log("Trip updated:", tripId, "Updated fields:", Object.keys(updateDoc));

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
