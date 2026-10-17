"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { MiniLightCalendar } from "@/components/light/MiniLightCalendar";
import { site } from "@/config/site";
import { countries } from "@/data/countries";
import { destinations } from "@/data/destinations";
import { journeys } from "@/data/journeys";
import { getPlace, places, type PlaceId } from "@/data/places";
import { comfortLevels, contactMethods, emptyEnquiry, interests, travelStyles, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/enquiry";
import { monthName } from "@/lib/format";

/** Turn ?journey=… or ?route=… into a starting point for the form. */
function prefill(params: URLSearchParams): Enquiry {
  const e: Enquiry = { ...emptyEnquiry };
  const journey = journeys.find((j) => j.slug === params.get("journey"));
  if (journey) {
    e.days = String(journey.days);
    e.style = journey.flightFree ? "flight-free" : "mixed";
    e.month = String(journey.bestMonths[0]);
    e.destinations = destinations.filter((d) => journey.stops.some((s) => d.name.startsWith(s))).map((d) => d.slug);
    e.notes = `Starting from: ${journey.title}.\n`;
  }
  const route = (params.get("route") ?? "").split(",").filter(Boolean);
  if (route.length) {
    const names = route.map((id) => places.find((p) => p.id === id)?.name).filter(Boolean);
    e.destinations = destinations.filter((d) => route.includes(d.placeId)).map((d) => d.slug);
    e.notes = `My slow route: ${names.join(" → ")}.\n`;
  }
  if (params.get("style") && travelStyles.some((s) => s.value === params.get("style"))) e.style = params.get("style")!;
  const month = Number(params.get("month"));
  if (month >= 1 && month <= 12) e.month = String(month);
  return e;
}

function Field({ label, error, id, children, hint }: { label: string; error?: string; id: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-[0.9375rem]">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[0.875rem] text-stone">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-sans text-sm text-lingon">
          {error}
        </p>
      )}
    </div>
  );
}

const input =
  "w-full border-0 border-b border-ink/30 bg-transparent px-0 py-2 font-sans text-base outline-none transition-colors focus:border-ink focus-visible:outline-none aria-[invalid=true]:border-lingon";

function Group({ legend, children, className = "" }: { legend: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={`border-t border-ink/15 pt-8 ${className}`}>
      <legend className="eyebrow float-left mb-6 w-full text-stone">{legend}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function EnquiryForm() {
  const params = useSearchParams();
  const [values, setValues] = useState<Enquiry>(() => prefill(new URLSearchParams(params.toString())));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const done = useRef<HTMLDivElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => setValues((v) => ({ ...v, [key]: value }));
  const toggleIn = (key: "destinations" | "interests", item: string) =>
    setValues((v) => ({ ...v, [key]: v[key].includes(item) ? v[key].filter((x) => x !== item) : [...v[key], item] }));

  const firstDestination = destinations.find((d) => values.destinations.includes(d.slug));
  const previewPlace = getPlace((firstDestination?.placeId ?? "tromso") as PlaceId);
  const month = Number(values.month) || undefined;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      requestAnimationFrame(() => done.current?.focus());
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div ref={done} tabIndex={-1} className="py-24 outline-none" role="status">
        <p className="headline">
          Thank you. We&rsquo;ll be in touch. <em>Follow the light.</em>
        </p>
        <p className="mt-6 max-w-lg text-stone">We reply within two working days, by {contactMethods.find((c) => c.value === values.contact)?.label.toLowerCase()}.</p>
      </div>
    );
  }

  const errorList = Object.entries(errors);
  const describedBy = (key: keyof Enquiry, hint = false) => [hint ? `${key}-hint` : "", errors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={submit} noValidate className="space-y-14">
      {errorList.length > 0 && (
        <div ref={errorSummary} tabIndex={-1} role="alert" className="border border-lingon p-5 outline-none">
          <p className="font-sans">A couple of things to check:</p>
          <ul className="mt-2 list-disc pl-5 text-[0.9375rem]">
            {errorList.map(([key, message]) => (
              <li key={key}>
                <a href={`#${key}`} className="underline">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Group legend="Where">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((c) => (
            <fieldset key={c.id}>
              <legend className="meta mb-3">{c.name}</legend>
              <ul className="space-y-2">
                {destinations
                  .filter((d) => d.country === c.id)
                  .map((d) => (
                    <li key={d.slug}>
                      <label className="flex items-start gap-3 font-sans text-[0.9375rem]">
                        <input type="checkbox" checked={values.destinations.includes(d.slug)} onChange={() => toggleIn("destinations", d.slug)} className="mt-1 size-4 shrink-0 accent-[var(--color-pine)]" />
                        {d.name}
                      </label>
                    </li>
                  ))}
              </ul>
            </fieldset>
          ))}
        </div>
        <p className="mt-6 text-[0.9375rem] text-stone">Not sure? Leave it empty and tell us what you&rsquo;d like to see.</p>
      </Group>

      <Group legend="When and how long">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 space-y-8 md:col-span-5">
            <Field id="month" label="Month">
              <select id="month" value={values.month} onChange={(e) => set("month", e.target.value)} className={input}>
                <option value="">Choose a month</option>
                <option value="flexible">Flexible: tell me when</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {monthName(i + 1, "long")}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="days" label="How many days" error={errors.days}>
              <input id="days" type="number" inputMode="numeric" min={2} max={60} value={values.days} onChange={(e) => set("days", e.target.value)} aria-invalid={!!errors.days} aria-describedby={describedBy("days")} className={input} placeholder="e.g. 10" />
            </Field>
            <div className="grid grid-cols-2 gap-6">
              <Field id="adults" label="Adults" error={errors.adults}>
                <input id="adults" type="number" inputMode="numeric" min={1} max={20} value={values.adults} onChange={(e) => set("adults", e.target.value)} aria-invalid={!!errors.adults} aria-describedby={describedBy("adults")} className={input} />
              </Field>
              <Field id="children" label="Children">
                <input id="children" type="number" inputMode="numeric" min={0} max={20} value={values.children} onChange={(e) => set("children", e.target.value)} className={input} />
              </Field>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="meta mb-4 text-stone">
              The light in {previewPlace.name}
              {month ? ` · ${monthName(month, "long")} highlighted` : ""}
            </p>
            <MiniLightCalendar place={previewPlace} year={new Date().getFullYear()} highlight={month} />
          </div>
        </div>
      </Group>

      <Group legend="How you like to travel">
        <div className="grid gap-10 md:grid-cols-2">
          <fieldset>
            <legend className="mb-3 font-sans text-[0.9375rem]">Travel style</legend>
            <div className="space-y-3">
              {travelStyles.map((s) => (
                <label key={s.value} className="flex gap-3">
                  <input type="radio" name="style" value={s.value} checked={values.style === s.value} onChange={() => set("style", s.value)} className="mt-1.5 size-4 accent-[var(--color-pine)]" />
                  <span>
                    <span className="block font-sans">{s.label}</span>
                    <span className="block text-[0.875rem] text-stone">{s.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 font-sans text-[0.9375rem]">Comfort</legend>
            <div className="space-y-3">
              {comfortLevels.map((c) => (
                <label key={c.value} className="flex gap-3">
                  <input type="radio" name="comfort" value={c.value} checked={values.comfort === c.value} onChange={() => set("comfort", c.value)} className="mt-1.5 size-4 accent-[var(--color-pine)]" />
                  <span>
                    <span className="block font-sans">{c.label}</span>
                    <span className="block text-[0.875rem] text-stone">{c.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <fieldset className="mt-10">
          <legend className="mb-3 font-sans text-[0.9375rem]">Interests</legend>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => {
              const on = values.interests.includes(i);
              return (
                <label key={i} className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-sans text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lingon ${on ? "border-pine bg-pine text-birch-50" : "border-ink/30 hover:border-ink"}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleIn("interests", i)} className="sr-only" />
                  {i}
                </label>
              );
            })}
          </div>
        </fieldset>
      </Group>

      <Group legend="You">
        <div className="grid gap-8 md:grid-cols-3">
          <Field id="name" label="Name" error={errors.name}>
            <input id="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={input} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={input} />
          </Field>
          <Field id="phone" label="Phone (optional)" error={errors.phone}>
            <input id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={input} />
          </Field>
        </div>
        <fieldset className="mt-8">
          <legend className="mb-3 font-sans text-[0.9375rem]">How should we reach you?</legend>
          <div className="flex flex-wrap gap-6">
            {contactMethods.map((c) => (
              <label key={c.value} className="flex items-center gap-2 font-sans">
                <input type="radio" name="contact" value={c.value} checked={values.contact === c.value} onChange={() => set("contact", c.value)} className="size-4 accent-[var(--color-pine)]" />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-8">
          <Field id="notes" label="Anything else" hint="Celebrations, mobility, food, the trip you'd do if nobody was watching." error={errors.notes}>
            <textarea id="notes" rows={5} value={values.notes} onChange={(e) => set("notes", e.target.value)} aria-invalid={!!errors.notes} aria-describedby={describedBy("notes", true)} className={`${input} resize-y`} />
          </Field>
        </div>
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>
      </Group>

      <div className="flex flex-wrap items-center gap-6 border-t border-ink pt-8">
        <button type="submit" disabled={status === "sending"} className="rounded-full bg-lingon px-6 py-3 font-sans font-medium text-birch-50 transition-colors hover:bg-lingon-deep disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-[0.9375rem] text-stone">No obligation. We reply within two working days.</p>
        {status === "failed" && (
          <p role="alert" className="w-full font-sans text-sm text-lingon">
            That didn&rsquo;t go through. Please try again, or write to us at {site.contact.email}.
          </p>
        )}
      </div>
    </form>
  );
}
