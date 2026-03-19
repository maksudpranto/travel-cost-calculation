import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const result = await db.query("SELECT NOW()");
        return NextResponse.json({ 
            status: "ok", 
            time: result.rows[0].now,
            database: "connected"
        });
    } catch (error: any) {
        console.error("Database connection error:", error);
        return NextResponse.json({ 
            status: "error", 
            message: error.message,
            code: error.code,
            address: error.address,
            port: error.port
        }, { status: 500 });
    }
}
