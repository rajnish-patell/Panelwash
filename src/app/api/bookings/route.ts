"use strict";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Global Prisma instance helper to prevent multiple instances in Next.js development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// In-Memory mock data fallback if Prisma/SQLite is not migrated yet
let mockBookings: any[] = [
  {
    id: "mock-1",
    name: "Amit Patel",
    mobileNumber: "9825012345",
    email: "amit.patel@yahoo.com",
    city: "Ahmedabad",
    address: "B-402 Shanti Corporate, Satellite",
    numberOfPanels: 24,
    propertyType: "RESIDENTIAL",
    serviceType: "AMC_QUARTERLY",
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    notes: "Please call 30 mins before arrival.",
    status: "APPROVED",
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "mock-2",
    name: "Pooja Sharma",
    mobileNumber: "9910098765",
    email: "pooja.s@gmail.com",
    city: "Gurugram",
    address: "Villa 18, Sector 54, Golf Course Road",
    numberOfPanels: 40,
    propertyType: "RESIDENTIAL",
    serviceType: "ONE_TIME",
    preferredDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    notes: "Rooftop access via elevator.",
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-3",
    name: "Mahindra Logistics (Attn: Sunil)",
    mobileNumber: "9845077112",
    email: "sunil.k@mahindralogistics.com",
    city: "Pune",
    address: "Chakan Industrial Area, Phase 2",
    numberOfPanels: 180,
    propertyType: "INDUSTRIAL",
    serviceType: "AMC_MONTHLY",
    preferredDate: new Date(Date.now() + 86400000).toISOString(),
    notes: "Requires safety harnesses and work permits.",
    status: "IN_PROGRESS",
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

// POST /api/bookings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      mobileNumber,
      email,
      city,
      address,
      numberOfPanels,
      propertyType,
      serviceType,
      preferredDate,
      notes,
    } = body;

    // Basic Validation
    if (!name || !mobileNumber || !email || !city || !address || !numberOfPanels || !preferredDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingPayload = {
      name,
      mobileNumber,
      email,
      city,
      address,
      numberOfPanels: Number(numberOfPanels),
      propertyType,
      serviceType,
      preferredDate: new Date(preferredDate),
      notes: notes || "",
      status: "PENDING",
      paymentStatus: "UNPAID",
    };

    let newBooking;
    let usedMockFallback = false;

    try {
      // Attempt Prisma create
      newBooking = await prisma.booking.create({
        data: bookingPayload,
      });
    } catch (dbError) {
      console.warn("Prisma write failed (SQLite dev.db might not be initialized). Falling back to mock memory storage:", dbError);
      usedMockFallback = true;
      newBooking = {
        id: `mock-${Date.now()}`,
        ...bookingPayload,
        preferredDate: new Date(preferredDate).toISOString(),
        createdAt: new Date().toISOString(),
      };
      mockBookings.unshift(newBooking);
    }

    // SIMULATED SYSTEM INTEGRATIONS
    console.log("---- PANELWASH INTEGRATION LOGS ----");
    
    // 1. Razorpay Order Creation Mock
    const mockRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 11)}`;
    console.log(`[RAZORPAY] Created order ${mockRazorpayOrderId} for amount: ₹${Number(numberOfPanels) * 120}`);

    // 2. SMS Notification (Customer)
    console.log(`[SMS - Twilio] Sent to ${mobileNumber}:
      "Namaste ${name}, thank you for choosing PanelWash! We have received your booking request for ${numberOfPanels} solar panels on ${new Date(preferredDate).toLocaleDateString()}. Our executive will contact you shortly to confirm the slot. Team PanelWash."`);

    // 3. WhatsApp Notification (Admin CRM)
    console.log(`[WhatsApp - Meta API] Sent to Admin (+919000000000):
      "New PanelWash Booking Alert!\nName: ${name}\nCity: ${city}\nPanels: ${numberOfPanels}\nProperty: ${propertyType}\nDate: ${new Date(preferredDate).toLocaleDateString()}\nPhone: ${mobileNumber}"`);

    // 4. Email Notification (Admin Lead System)
    console.log(`[EMAIL - Resend] Sent to dispatch@panelwash.in:
      Subject: [NEW LEAD] Solar Panel Cleaning Request - ${name} (${city})
      Details: ${JSON.stringify(bookingPayload, null, 2)}`);
      
    console.log("------------------------------------");

    return NextResponse.json({
      success: true,
      booking: newBooking,
      razorpayOrderId: mockRazorpayOrderId,
      usedMockFallback
    }, { status: 201 });

  } catch (error: any) {
    console.error("Booking handler error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/bookings
export async function GET() {
  try {
    let bookings;
    let usedMockFallback = false;

    try {
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
      });
      // If DB is empty, mix in some mock bookings so the dashboard is not empty on initial run
      if (bookings.length === 0) {
        bookings = mockBookings;
      }
    } catch (dbError) {
      console.warn("Prisma fetch failed, serving mock bookings:", dbError);
      usedMockFallback = true;
      bookings = mockBookings;
    }

    return NextResponse.json({
      success: true,
      bookings,
      usedMockFallback
    }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
