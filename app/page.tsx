"use client";

import { Hero } from "./_components/hero";
import { CustomBuildSection } from "./_components/custom-build-section";
import { PrebuiltPCSection } from "./_components/prebuilt-pc-section";
import { ComponentsAccessoriesSection } from "./_components/components-accessories-section";
import { HomeLayout } from "@/components/_layouts/home-layout";

export default function Page() {
    return (
        <HomeLayout>
            <div className="space-y-14">
                <Hero />
                <CustomBuildSection />
                <PrebuiltPCSection />
                <ComponentsAccessoriesSection />
            </div>
        </HomeLayout>
    );
}
