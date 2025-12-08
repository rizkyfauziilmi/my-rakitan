'use client';

import { Hero } from './_components/hero';
import { CustomBuildSection } from './_components/custom-build-section';
import { PrebuiltPCSection } from './_components/prebuilt-pc-section';
import { ComponentsAccessoriesSection } from './_components/components-accessories-section';
import { HomeLayout } from '@/components/_layouts/home-layout';

export default function Page() {
  return (
    <HomeLayout>
      <main className="space-y-14 px-4 sm:px-6 lg:px-8">
        <Hero />
        <CustomBuildSection />
        <PrebuiltPCSection />
        <ComponentsAccessoriesSection />
      </main>
    </HomeLayout>
  );
}
