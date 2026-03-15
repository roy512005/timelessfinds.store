'use client';

export default function BannersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Banners Management</h1>
                    <p className="text-gray-500 mt-1">Update main sliders, heroes, and seasonal banners.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Hero Banner Manager */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Hero Banner Layout</h2>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-wider pl-2 pr-2">Active on Live</span>
                    </div>
                    <div className="p-6">
                        <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" alt="Current Hero" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="flex-1 bg-black text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                Upload New Image
                            </button>
                            <button className="flex-1 border border-gray-300 bg-white text-gray-900 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors">
                                Edit Action Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Seasonal Promotional Banner */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Season Sale Banner</h2>
                        <span className="px-2 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded uppercase tracking-wider pl-2 pr-2">Scheduled Drop</span>
                    </div>
                    <div className="p-6">
                        <div className="w-full bg-rose-50 border border-rose-200 border-dashed rounded-lg h-32 flex items-center justify-center flex-col text-rose-400">
                            <p className="font-bold uppercase tracking-widest text-xs mb-2">No Image Uploaded</p>
                            <span className="text-4xl text-rose-300">📸</span>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button className="flex-1 bg-gray-100 text-gray-600 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors border border-gray-300">
                                Select File
                            </button>
                            <input type="text" placeholder="Add Link (e.g., /collections/summer)" className="flex-[2] border border-gray-300 rounded-sm px-4 py-2 text-sm focus:border-black focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
