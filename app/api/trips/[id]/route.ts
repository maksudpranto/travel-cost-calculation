import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
        const { name, currency, startDate, endDate, people, expenses, type, touristCount, feePerPerson, status } = data;

        const updateFields: string[] = [];
        const values: any[] = [];
        let placeholderIndex = 1;

        const addField = (name: string, value: any) => {
            if (value !== undefined) {
                updateFields.push(`"${name}" = $${placeholderIndex++}`);
                values.push(typeof value === 'object' ? JSON.stringify(value) : value);
            }
        };

        addField("name", name);
        addField("currency", currency);
        addField("startDate", startDate);
        addField("endDate", endDate);
        addField("people", people);
        addField("expenses", expenses);
        addField("type", type);
        addField("touristCount", touristCount);
        addField("feePerPerson", feePerPerson);
        addField("status", status);

        updateFields.push(`"updatedAt" = $${placeholderIndex++}`);
        values.push(new Date());

        if (updateFields.length === 1) {
             return NextResponse.json({ message: "No fields to update" });
        }

        const query = `
            UPDATE trips 
            SET ${updateFields.join(", ")} 
            WHERE "id" = $${placeholderIndex++} AND "userId" = $${placeholderIndex++}
        `;
        values.push(tripId, session.user.id);

        const result = await db.query(query, values);

        if (result.rowCount === 0) {
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

        const result = await db.query(
            'DELETE FROM trips WHERE "id" = $1 AND "userId" = $2',
            [tripId, session.user.id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Trip not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
