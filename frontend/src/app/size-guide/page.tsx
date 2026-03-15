import { Ruler, Scissors } from 'lucide-react';

export default function SizeGuidePage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Ruler className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Size Guide</h1>
                    <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-sm leading-relaxed">
                        Find your perfect fit. Our dresses are tailored to true-to-size standards unless specified otherwise on the product page.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 mb-16">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8 border-b border-gray-200 pb-4">Standard Measurements (Inches)</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-4 px-6 bg-white border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-900">Size</th>
                                    <th className="py-4 px-6 bg-white border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-900">US</th>
                                    <th className="py-4 px-6 bg-white border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-900">Bust</th>
                                    <th className="py-4 px-6 bg-white border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-900">Waist</th>
                                    <th className="py-4 px-6 bg-white border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-900">Hip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { size: 'XS', us: '0-2', bust: '31-32', waist: '24-25', hip: '34-35' },
                                    { size: 'S', us: '4-6', bust: '33-35', waist: '26-28', hip: '36-38' },
                                    { size: 'M', us: '8-10', bust: '36-38', waist: '29-31', hip: '39-41' },
                                    { size: 'L', us: '12-14', bust: '39-41', waist: '32-34', hip: '42-44' },
                                    { size: 'XL', us: '16-18', bust: '42-44', waist: '35-37', hip: '45-47' },
                                ].map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-white'}>
                                        <td className="py-4 px-6 border-b border-gray-100 font-bold text-gray-900">{row.size}</td>
                                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{row.us}</td>
                                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{row.bust}"</td>
                                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{row.waist}"</td>
                                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{row.hip}"</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">How to Measure</h2>
                        <ul className="space-y-6">
                            <li>
                                <h3 className="font-bold uppercase tracking-widest text-sm text-gray-900 mb-2">Bust</h3>
                                <p className="text-gray-600 text-sm">Measure around the fullest part of your bust, keeping the measuring tape horizontal.</p>
                            </li>
                            <li>
                                <h3 className="font-bold uppercase tracking-widest text-sm text-gray-900 mb-2">Waist</h3>
                                <p className="text-gray-600 text-sm">Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.</p>
                            </li>
                            <li>
                                <h3 className="font-bold uppercase tracking-widest text-sm text-gray-900 mb-2">Hip</h3>
                                <p className="text-gray-600 text-sm">Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                            </li>
                        </ul>

                        <div className="mt-8 p-6 bg-rose-50 rounded-xl border border-rose-100 flex items-start">
                            <Scissors className="w-5 h-5 text-rose-600 mt-1 mr-4 shrink-0" />
                            <div>
                                <h4 className="font-bold text-rose-900 text-sm uppercase tracking-widest mb-1">Between Sizes?</h4>
                                <p className="text-rose-800 text-sm leading-relaxed">If your measurements are between sizes, we recommend sizing up for woven (non-stretch) fabrics and sizing down for knits (stretch) fabrics.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 aspect-[3/4] rounded-2xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1544256718-3baf24835661?w=800&q=80"
                            alt="Measurement Guide"
                            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                        />
                        {/* Mock overlay lines could go here */}
                    </div>
                </div>

            </div>
        </div>
    );
}
