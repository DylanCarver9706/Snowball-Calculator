import { clerk } from "@/lib/clerk";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as NextRequest);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { metadata } = await req.json();

    if (!metadata) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    // Update the user's public metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating user metadata:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
