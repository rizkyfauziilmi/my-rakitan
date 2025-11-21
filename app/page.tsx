"use client";

import { Hero } from "./_components/hero";
import { CustomBuildSection } from "./_components/custom-build-section";
import { PrebuiltPCSection } from "./_components/prebuilt-pc-section";

export default function Page() {
  return (
    <div>
      <Hero />
      <CustomBuildSection />
      <PrebuiltPCSection />
    </div>
  );
}
