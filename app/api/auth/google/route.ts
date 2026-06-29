import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    return NextResponse.json({ token});
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}