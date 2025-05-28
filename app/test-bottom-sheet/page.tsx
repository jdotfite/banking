'use client';

import React, { useState } from 'react';
import { CustomBottomSheet } from '@/components/ui/BottomSheet';
import PageTemplate from '@/components/layout/PageTemplate';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Test content components with different heights
const ShortContent = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold text-white">Short Content</h2>
    <p className="text-neutral-300">This is a short content example that should size the bottom sheet to fit exactly.</p>
    <button className="bg-blue-500 text-white px-4 py-2 rounded">Test Button</button>
  </div>
);

const MediumContent = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold text-white">Medium Content</h2>
    <p className="text-neutral-300">This is medium content that should demonstrate dynamic sizing.</p>
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="bg-neutral-700 p-3 rounded">
        <h3 className="text-white font-medium">Item {i + 1}</h3>
        <p className="text-neutral-400 text-sm">Description for item {i + 1}</p>
      </div>
    ))}
  </div>
);

const LongScrollableContent = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold text-white">Long Scrollable Content</h2>
    <p className="text-neutral-300">This content should exceed the max height and become scrollable.</p>
    {Array.from({ length: 15 }, (_, i) => (
      <div key={i} className="bg-neutral-700 p-4 rounded">
        <h3 className="text-white font-medium">Scrollable Item {i + 1}</h3>
        <p className="text-neutral-400 text-sm">
          This is a longer description for item {i + 1} that contains more text 
          to make the content area larger and test scrolling behavior properly.
        </p>
        <div className="mt-2 flex space-x-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Action</button>
          <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Info</button>
        </div>
      </div>
    ))}
  </div>
);

export default function TestBottomSheetPage() {
  const [showShort, setShowShort] = useState(false);
  const [showMedium, setShowMedium] = useState(false);
  const [showLong, setShowLong] = useState(false);
  const [showFixed, setShowFixed] = useState(false);
  const router = useRouter();

  return (
    <PageTemplate>
      {/* Custom Header with Back Button */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="ml-2">
            <h1 className="text-xl font-medium text-white">Bottom Sheet Tests</h1>
            <p className="text-neutral-400 text-sm">Test dynamic sizing and scroll behavior</p>
          </div>
        </div>
      </div>      <div className="px-6 space-y-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Bottom Sheet Test Cases</h2>
          <p className="text-neutral-300">
            Test different content sizes and behavior of the dynamic bottom sheet implementation.
          </p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => setShowShort(true)}
            className="bg-blue-500 text-white p-4 rounded-lg text-left"
          >
            <h3 className="font-medium">Test 1: Short Content</h3>
            <p className="text-blue-100 text-sm">Dynamic sizing with minimal content</p>
          </button>

          <button
            onClick={() => setShowMedium(true)}
            className="bg-green-500 text-white p-4 rounded-lg text-left"
          >
            <h3 className="font-medium">Test 2: Medium Content</h3>
            <p className="text-green-100 text-sm">Dynamic sizing with moderate content</p>
          </button>          <button
            onClick={() => setShowLong(true)}
            className="bg-orange-500 text-white p-4 rounded-lg text-left"
          >
            <h3 className="font-medium">Test 3: Long Content (70vh Cap)</h3>
            <p className="text-orange-100 text-sm">Content that tests 70vh viewport height cap</p>
          </button>

          <button
            onClick={() => setShowFixed(true)}
            className="bg-purple-500 text-white p-4 rounded-lg text-left"
          >
            <h3 className="font-medium">Test 4: Fixed Snap Points</h3>
            <p className="text-purple-100 text-sm">Traditional fixed snap points without dynamic sizing</p>
          </button>
        </div>

        <div className="mt-8 p-4 bg-neutral-800 rounded-lg">
          <h3 className="text-white font-medium mb-2">Test Instructions:</h3>
          <ul className="text-neutral-300 text-sm space-y-1">
            <li>• Open each test case and observe how the sheet sizes to content</li>            <li>• Try dragging the sheet to test gesture handling</li>
            <li>• For scrollable content, scroll within the sheet (should not close)</li>
            <li>• Try drag-to-close from non-scrollable areas</li>
            <li>• Test snap points behavior (where applicable)</li>
            <li>• Note: Content is capped at 70vh (70% of viewport height)</li>
          </ul>
        </div>
      </div>

      {/* Test Bottom Sheets */}
      <CustomBottomSheet
        open={showShort}
        onDismiss={() => setShowShort(false)}
        header="Short Content Test"
        theme="dark"
        maxHeight={600}
        snapPoints={['content', 400]}
        initialSnap={0}
        enableDynamicSizing={true}
        onSnap={(index) => console.log('Short content snapped to:', index)}
      >
        <ShortContent />
      </CustomBottomSheet>

      <CustomBottomSheet
        open={showMedium}
        onDismiss={() => setShowMedium(false)}
        header="Medium Content Test"
        theme="dark"
        maxHeight={700}
        snapPoints={['content', 500]}
        initialSnap={0}
        enableDynamicSizing={true}
        onSnap={(index) => console.log('Medium content snapped to:', index)}
      >
        <MediumContent />
      </CustomBottomSheet>

      <CustomBottomSheet
        open={showLong}
        onDismiss={() => setShowLong(false)}
        header="Long Scrollable Content Test"
        theme="dark"
        maxHeight={600}
        snapPoints={['content', 400, 600]}
        initialSnap={0}
        enableDynamicSizing={true}
        onSnap={(index) => console.log('Long content snapped to:', index)}
      >
        <LongScrollableContent />
      </CustomBottomSheet>

      <CustomBottomSheet
        open={showFixed}
        onDismiss={() => setShowFixed(false)}
        header="Fixed Snap Points Test"
        theme="dark"
        maxHeight={600}
        snapPoints={[200, 400, 600]}
        initialSnap={1}
        enableDynamicSizing={false}
        onSnap={(index) => console.log('Fixed snapped to:', index)}
      >
        <MediumContent />
      </CustomBottomSheet>
    </PageTemplate>
  );
}
