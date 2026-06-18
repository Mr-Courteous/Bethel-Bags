import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackPayment } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const { reference, enrolmentId } = await req.json();
    const verification = await verifyPaystackPayment(reference);
    if (verification.data?.status === "success") {
      await prisma.enrolment.update({
        where: { id: enrolmentId },
        data: { status: "CONFIRMED", paystackRef: reference },
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
