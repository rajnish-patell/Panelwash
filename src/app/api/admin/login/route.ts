"use strict";

import { NextResponse } from "next/server";

// ──────────────────────────────────────────────
// CHANGE THIS to your own secret password & key
// ──────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "panelwash@2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "pw-admin-secret-key-change-me";

// Simple hash to create a session token (not crypto-grade, but sufficient for single-user admin)
function createSessionToken(): string {
  const payload = `${SESSION_SECRET}-${Date.now()}`;
  // Base64 encode a simple token
  return Buffer.from(payload).toString("base64");
}

// POST /api/admin/login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Password matches — create session
    const token = createSessionToken();

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set HTTP-only cookie that lasts 24 hours
    response.cookies.set("pw_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
