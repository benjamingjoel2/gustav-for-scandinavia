import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Tell us where, when and how slowly. We plan private journeys through Norway, Sweden, Denmark and Finland, and reply within two working days.",
  alternates: { canonical: "/enquire" },
};

export default function EnquirePage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <header className="gutter grid-12 gap-y-6 pb-12 pt-16 md:pt-24">
        <p className="eyebrow col-span-12 text-stone">Enquire</p>
        <h1 className="headline col-span-12 md:col-span-8">
          Tell us where, when, and <em>how slowly.</em>
        </h1>
        <p className="col-span-12 text-stone md:col-span-4 md:self-end">Everything is optional except how to reach you. A planner reads every enquiry and replies personally.</p>
      </header>
      <div className="gutter relative pb-24">
                  <EnquiryForm />
      </div>
    </div>
  );
}
