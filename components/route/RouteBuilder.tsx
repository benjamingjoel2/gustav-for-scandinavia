"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PillLink } from "@/components/ui/Links";
import { Tag } from "@/components/ui/Tag";
import { countries } from "@/data/countries";
import { places } from "@/data/places";
import { slowRoutes } from "@/data/routes";
import { monthName } from "@/lib/format";
import { planRoute, type PlannedLeg } from "@/lib/routing";
import { useInitialUrlParams } from "@/lib/use-url-params";
import { formatDuration } from "@/lib/solar";
import type { Month } from "@/types/content";
import { modeLabel } from "./modes";
import { ScandinaviaMap } from "./ScandinaviaMap";

const nameOf = (id: string) => places.find((p) => p.id === id)?.name ?? id;
const known = new Set<string>(places.map((p) => p.id));

function LegLine({ leg, alternative = false }: { leg: PlannedLeg; alternative?: boolean }) {
  return (
    <div className={alternative ? "border-l border-ink/20 pl-3" : ""}>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="meta w-28 shrink-0 text-stone">{modeLabel[leg.mode]}</span>
        <span className="font-sans">
          {alternative && "Or: "}
          {leg.name ?? `${nameOf(leg.start)} to ${nameOf(leg.end)}`}
        </span>
        <span className="meta">≈ {formatDuration(leg.minutes)}</span>
        {leg.scenic && <Tag className="text-oak-deep">Scenic</Tag>}
        {leg.seasonal && <Tag className="text-stone">{`${monthName(leg.seasonal[0])}–${monthName(leg.seasonal.at(-1)!)}`}</Tag>}
      </p>
      {leg.note && <p className="mt-1 text-[0.9375rem] text-stone sm:pl-[8.75rem]">{leg.note}</p>}
    </div>
  );
}

function PlaceList({ stops, onToggle }: { stops: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
      {countries.map((c) => (
        <fieldset key={c.id}>
          <legend className="meta mb-3 text-stone">{c.name}</legend>
          <ul className="space-y-1.5">
            {places
              .filter((p) => p.country === c.id)
              .map((p) => (
                <li key={p.id}>
                  <label className="flex items-center gap-3 font-sans text-[0.9375rem]">
                    <input type="checkbox" checked={stops.includes(p.id)} onChange={() => onToggle(p.id)} className="size-4 accent-[var(--color-lingon)]" />
                    {p.name}
                  </label>
                </li>
              ))}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}

/**
 * Pick places on the map (or from the list); the builder joins them by train, ferry, coastal ship or car.
 * State lives in the URL so a route can be shared or sent to the enquiry form.
 */
export function RouteBuilder() {
  const [state, setState] = useState<{ stops: string[]; flightFree: boolean; month?: Month }>({ stops: [], flightFree: true });
  // A shared link (?stops=…&flights=1&month=7) restores its route; afterwards the URL mirrors local state.
  useInitialUrlParams((params) => {
    const m = Number(params.get("month"));
    setState({
      stops: (params.get("stops") ?? "").split(",").filter((s) => known.has(s)),
      flightFree: params.get("flights") !== "1",
      month: m >= 1 && m <= 12 ? (m as Month) : undefined,
    });
  });
  const { stops, flightFree, month } = state;

  const update = (next: Partial<typeof state>) => {
    const merged = { ...state, ...next };
    setState(merged);
    const q = new URLSearchParams();
    if (merged.stops.length) q.set("stops", merged.stops.join(","));
    if (!merged.flightFree) q.set("flights", "1");
    if (merged.month) q.set("month", String(merged.month));
    window.history.replaceState(null, "", `${window.location.pathname}${q.size ? `?${q}` : ""}`);
  };

  const toggle = (id: string) => update({ stops: stops.includes(id) ? stops.filter((s) => s !== id) : [...stops, id] });
  const move = (i: number, by: -1 | 1) => {
    const next = [...stops];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    update({ stops: next });
  };

  const plan = useMemo(() => planRoute(stops, { flightFree, month }), [stops, flightFree, month]);
  const legs = plan.segments.flatMap((s) => s.legs);
  const enquiry = `/enquire?route=${stops.join(",")}${flightFree ? "&style=flight-free" : ""}${month ? `&month=${month}` : ""}`;

  return (
    <div className="grid-12 gap-y-10">
      <div className="col-span-12 lg:col-span-7">
        <ScandinaviaMap stops={stops} legs={legs} onToggle={toggle} />
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-hidden>
          {[
            ["Train", undefined],
            ["Ferry, ship", "6 5"],
            ["Car, bus", "1.5 5"],
            ["Flight", "2 8"],
          ].map(([label, dash]) => (
            <span key={label} className="meta flex items-center gap-2 text-stone">
              <svg width="28" height="6">
                <line x1="1" x2="27" y1="3" y2="3" stroke="currentColor" strokeWidth="2" strokeDasharray={dash} strokeLinecap="round" />
              </svg>
              {label}
            </span>
          ))}
          <span className="meta flex items-center gap-2 text-oak-deep">
            <svg width="28" height="6">
              <line x1="1" x2="27" y1="3" y2="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            Scenic
          </span>
        </div>

        {/* On small screens the list is the main control; on large screens it sits behind a disclosure. */}
        <div className="mt-8 border-t border-ink/15 pt-4 lg:hidden">
          <p className="font-sans text-[0.9375rem]">Choose places</p>
          <PlaceList stops={stops} onToggle={toggle} />
        </div>
        <details className="mt-8 hidden border-t border-ink/15 pt-4 lg:block">
          <summary className="cursor-pointer font-sans text-[0.9375rem]">Choose places from a list</summary>
          <PlaceList stops={stops} onToggle={toggle} />
        </details>
      </div>

      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        <div className="space-y-5 border-y border-ink/15 py-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block font-sans">Flight-free</span>
              <span className="block text-[0.9375rem] text-stone">Rail and sea first. We fly only where there is no other way.</span>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={flightFree}
              onChange={(e) => update({ flightFree: e.target.checked })}
              className="peer sr-only"
            />
            <span aria-hidden className="relative h-6 w-11 shrink-0 rounded-full bg-ink/25 transition-colors peer-checked:bg-pine peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lingon after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-birch-50 after:transition-transform peer-checked:after:translate-x-5" />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="font-sans">Travelling in</span>
            <select
              value={month ?? ""}
              onChange={(e) => update({ month: e.target.value ? (Number(e.target.value) as Month) : undefined })}
              className="border border-ink/30 bg-transparent px-2 py-1.5 font-sans text-[0.9375rem]"
            >
              <option value="">Any month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {monthName(i + 1, "long")}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h2 className="eyebrow mt-8 text-stone">Your stops</h2>
        {stops.length === 0 ? (
          <p className="mt-4 text-stone">Pick two or more places on the map, or start from one of the slow routes below.</p>
        ) : (
          <ol className="mt-4 space-y-2">
            {stops.map((id, i) => (
              <li key={id} className="flex items-center gap-3 border-b border-ink/10 pb-2">
                <span className="meta w-5 text-lingon">{i + 1}</span>
                <span className="flex-1 font-sans">{nameOf(id)}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${nameOf(id)} earlier`} className="px-1.5 text-stone hover:text-ink disabled:opacity-25">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === stops.length - 1} aria-label={`Move ${nameOf(id)} later`} className="px-1.5 text-stone hover:text-ink disabled:opacity-25">
                  ↓
                </button>
                <button type="button" onClick={() => toggle(id)} aria-label={`Remove ${nameOf(id)}`} className="px-1.5 text-stone hover:text-lingon">
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}

        <div aria-live="polite">
          {plan.segments.length > 0 && (
            <>
              <h2 className="eyebrow mt-10 text-stone">How to get there, slowly</h2>
              <ol className="mt-4 space-y-6">
                {plan.segments.map((seg) => (
                  <li key={`${seg.from}-${seg.to}`} className="border-t border-ink/15 pt-4">
                    <h3 className="font-serif text-xl font-light">
                      {nameOf(seg.from)} <span className="text-stone">to</span> {nameOf(seg.to)}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {seg.legs.map((leg, i) => (
                        <LegLine key={`${leg.id}-${i}`} leg={leg} />
                      ))}
                      {seg.alternatives.map((leg) => (
                        <LegLine key={leg.id} leg={leg} alternative />
                      ))}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-ink pt-4">
                <p className="flex justify-between font-sans">
                  <span>Time travelling</span>
                  <span className="meta text-base">≈ {formatDuration(plan.totalMinutes)}</span>
                </p>
                {flightFree && (
                  <p className="mt-3 text-[0.9375rem] text-stone">
                    Roughly {plan.emissions.route} kg CO₂e per person, against about {plan.emissions.flying} kg flying the same hops.
                    {legs.some((l) => l.mode === "coastal-ship") && " Coastal ships are slow and lovely, but not low-carbon."} These are rough
                    estimates; <Link href="/travelling-lighter" className="link-dotted">here is how we make them</Link>.
                  </p>
                )}
                {flightFree && plan.usesFlight && <p className="mt-3 text-[0.9375rem]">Svalbard can only sensibly be reached by air, so this route includes one flight.</p>}
              </div>
            </>
          )}
          {plan.unreachable.map((u) => (
            <p key={`${u.from}-${u.to}`} className="mt-4 text-[0.9375rem] text-lingon">
              We don&rsquo;t have a connection from {nameOf(u.from)} to {nameOf(u.to)} {month ? `in ${monthName(month, "long")}` : ""}. Ask us; there may well be one.
            </p>
          ))}
        </div>

        {stops.length > 0 && (
          <PillLink href={enquiry} className="mt-8">
            Ask us to plan this route
          </PillLink>
        )}
      </div>

      <section aria-labelledby="slow-routes-title" className="col-span-12 mt-16 border-t border-ink/15 pt-12">
        <p className="eyebrow text-stone">Slow routes</p>
        <h2 id="slow-routes-title" className="headline mt-4">
          Twelve ways to take <em>the long way.</em>
        </h2>
        <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {slowRoutes.map((r) => (
            <li key={r.id} className="border-t border-ink/15 pt-4">
              <h3 className="font-sans text-lg">{r.name}</h3>
              <p className="meta mt-2 text-stone">{r.stops.map(nameOf).join(" → ")}</p>
              <p className="mt-2">{r.description}</p>
              <button
                type="button"
                onClick={() => {
                  update({ stops: r.stops });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="link-dotted mt-3"
              >
                Load this route ↑
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
