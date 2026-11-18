import type { Metadata } from "next";
import { Onboarding } from "@/components/onboarding/Onboarding";

export const metadata: Metadata = { title: "How it works · Quantum Secret Sharing" };

export default function TourPage() {
  return <Onboarding />;
}
