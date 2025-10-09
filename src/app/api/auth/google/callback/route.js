import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionOnResponse } from "@/lib/session";
import { getUser } from "@/lib/util";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = (await cookies()).get("google_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=google_state", request.url));
  }

  // Clear state cookie
  (await cookies()).delete("google_oauth_state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=google_token", request.url));
    }

    const tokens = await tokenRes.json();

    // Validate ID token and extract claims using Google's tokeninfo or decode locally
    // We'll call the tokeninfo endpoint for simplicity
    const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`);
    if (!infoRes.ok) {
      return NextResponse.redirect(new URL("/login?error=google_idtoken", request.url));
    }
    const claims = await infoRes.json();

    const email = claims.email;
    const emailVerified = claims.email_verified === "true" || claims.email_verified === true;

    if (!email || !emailVerified) {
      return NextResponse.redirect(new URL("/login?error=google_email", request.url));
    }

    // Find the user in our DB by email to get role/name
    const user = await getUser(email);
    if (!user) {
      return NextResponse.redirect(new URL("/login?error=invaliduser", request.url));
    }

    // Build the redirect first, then attach the cookie to the same response
    const redirectRes = NextResponse.redirect(new URL("/login?google=1", request.url));
    if (user.role === "volunteer") {
      const incharge = await getUser(user.incharge_email);
      return createSessionOnResponse(redirectRes, {
        email: user.email,
        role: user.role,
        name: user.name,
        incharge_email: incharge?.email,
        incharge_name: incharge?.name,
      });
    }
    return createSessionOnResponse(redirectRes, {
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (e) {
    return NextResponse.redirect(new URL("/login?error=google_exception", request.url));
  }
}


