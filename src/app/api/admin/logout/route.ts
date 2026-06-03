"use strict";

import { NextResponse } from "next/server";

// POST /api/admin/logout
export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear the admin session cookie
  response.cookies.set("pw_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
