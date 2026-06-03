"use strict";

import { NextResponse } from "next/server";

// PATCH /api/bookings/[id]
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const updatePayload: any = {};
    if (status) updatePayload.status = status;
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;

    // Return a simulated updated object
    const updatedBooking = {
      id,
      ...updatePayload,
      updatedAt: new Date().toISOString()
    };

    console.log(`[SYSTEM LOG] Updated booking ${id} parameters:`, updatePayload);

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
