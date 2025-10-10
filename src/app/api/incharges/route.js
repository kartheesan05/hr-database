import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "incharge" && session.role !== "volunteer") {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 403 });
    }

    const query = `
      SELECT name, email
      FROM users
      WHERE role = 'incharge'
      ORDER BY name
    `;

    const result = await db.query(query, []);
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching incharges:", error);
    return NextResponse.json({ errors: "Server Error" }, { status: 500 });
  }
}


