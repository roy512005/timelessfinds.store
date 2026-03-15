'use client';

import dynamic from 'next/dynamic';

const MapPickerWithNoSSR = dynamic(() => import('./MapPicker'), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white px-10 py-8 rounded-sm shadow-xl flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Loading Map...</p>
            </div>
        </div>
    )
});

export default MapPickerWithNoSSR;
