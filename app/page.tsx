import { LiveLight } from "@/components/light/LiveLight";

export const revalidate = 600;

/** Rendered at most every ten minutes (ISR); the client takes over the clock after hydration. */
function renderedAt() {
  return Date.now();
}

export default function Home() {
  return (
    <>
      <LiveLight initialNow={renderedAt()} />
      <div id="intro" />
    </>
  );
}
