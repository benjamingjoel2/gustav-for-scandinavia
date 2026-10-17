import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image: the wordmark resting on the horizon. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#101b21", color: "#fbf9f4", padding: 72 }}>
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.7 }}>{site.tagline}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 220, letterSpacing: -12, lineHeight: 0.9, fontWeight: 300 }}>gustav</div>
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 36, height: 60, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "rgba(251,249,244,0.45)" }} />
            <div style={{ position: "absolute", left: 520, bottom: 2, width: 76, height: 38, borderTopLeftRadius: 38, borderTopRightRadius: 38, background: "#a57d4e" }} />
          </div>
        </div>
        <div style={{ fontSize: 34, fontStyle: "italic", opacity: 0.85 }}>{site.promise}</div>
      </div>
    ),
    size,
  );
}
