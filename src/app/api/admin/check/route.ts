"use strict";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET /api/admin/check — verify if the user has a valid admin session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("pw_admin_session");

    if (!session || !session.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Session cookie exists — user is authenticated
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error: any) {
    console.error("Admin check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
