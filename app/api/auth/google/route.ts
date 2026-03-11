import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload()!;

    const appToken = jwt.sign(
      { userId: payload.sub, email: payload.email, name: payload.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token: appToken, user: payload });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}