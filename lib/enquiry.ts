/** Shared by the enquiry form and the API route. */

export const travelStyles = [
  { value: "flight-free", label: "Flight-free", hint: "Rail and sea only, where it works" },
  { value: "mixed", label: "Mixed", hint: "Slow where it matters, a flight where it saves a day" },
  { value: "fastest", label: "Fastest", hint: "Fly between regions, slow down once there" },
] as const;

export const comfortLevels = [
  { value: "characterful", label: "Simple and characterful", hint: "Cabins, guesthouses, places with a story" },
  { value: "comfortable", label: "Comfortable", hint: "Small hotels with good beds and good breakfasts" },
  { value: "indulgent", label: "Very comfortable", hint: "The best rooms we can find, and time to enjoy them" },
] as const;

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
] as const;

export const interests = [
  "Northern lights",
  "Midnight sun",
  "Fjords",
  "Coastal voyage",
  "Husky sledding",
  "Reindeer with Sámi hosts",
  "Winter whales",
  "New Nordic food",
  "Design and architecture",
  "Sauna",
  "Archipelago sailing",
  "Cabins",
  "Sleeper trains",
  "Christmas markets",
  "Hiking and kayaking",
] as const;

export interface Enquiry {
  destinations: string[];
  month: string; // "1"–"12" or "flexible"
  days: string;
  adults: string;
  children: string;
  style: string;
  interests: string[];
  comfort: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  notes: string;
  /** Honeypot: humans leave this empty. */
  website?: string;
}

export const emptyEnquiry: Enquiry = {
  destinations: [],
  month: "",
  days: "",
  adults: "2",
  children: "0",
  style: "mixed",
  interests: [],
  comfort: "comfortable",
  name: "",
  email: "",
  phone: "",
  contact: "email",
  notes: "",
  website: "",
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!e.name.trim()) errors.name = "Please tell us your name.";
  if (!EMAIL.test(e.email.trim())) errors.email = "Please check your email address.";
  if ((e.contact === "phone" || e.contact === "whatsapp") && e.phone.replace(/\D/g, "").length < 6)
    errors.phone = "Please add a number so we can reach you that way.";
  const days = Number(e.days);
  if (e.days && (!Number.isInteger(days) || days < 2 || days > 60)) errors.days = "Between 2 and 60 days, please.";
  const adults = Number(e.adults);
  if (!Number.isInteger(adults) || adults < 1 || adults > 20) errors.adults = "At least one adult, please.";
  if (e.notes.length > 4000) errors.notes = "That's a little long; we'll talk through the rest.";
  return errors;
}
