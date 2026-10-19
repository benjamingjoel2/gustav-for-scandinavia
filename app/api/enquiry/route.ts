import { NextResponse } from "next/server";
import { emptyEnquiry, validateEnquiry, type Enquiry } from "@/lib/enquiry";

export async function POST(request: Request) {
  let body: Partial<Enquiry>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Keep only known fields, as strings.
  const enquiry: Enquiry = { ...emptyEnquiry };
  for (const key of Object.keys(emptyEnquiry) as (keyof Enquiry)[]) {
    const value = body[key];
    if (Array.isArray(emptyEnquiry[key])) (enquiry[key] as string[]) = Array.isArray(value) ? value.map(String).slice(0, 40) : [];
    else if (value !== undefined) (enquiry[key] as string) = String(value).slice(0, 4000);
  }

  // Bots fill the hidden field; accept quietly and drop it.
  if (enquiry.website) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const { website: _honeypot, ...payload } = enquiry; // eslint-disable-line @typescript-eslint/no-unused-vars
  // TODO: send to the CRM (and an acknowledgement email) once it is chosen. Logged for now.
  console.log("[enquiry]", JSON.stringify({ receivedAt: new Date().toISOString(), ...payload }));

  return NextResponse.json({ ok: true });
}
