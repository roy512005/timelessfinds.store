export default function ShippingPolicyPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Shipping Policy</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Effective Date: January 1, 2024</p>
                </header>

                <article className="prose prose-gray max-w-none text-gray-600 leading-relaxed font-serif">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">1. Processing Time</h2>
                    <p className="mb-8">All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">2. Domestic Shipping Rates and Estimates</h2>
                    <p className="mb-4">Shipping charges for your order will be calculated and displayed at checkout.</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-8 font-sans">
                        <ul className="space-y-3 m-0 p-0 list-none">
                            <li className="flex justify-between border-b border-gray-200 pb-3">
                                <strong>Standard (3-5 business days)</strong>
                                <span>Free on orders over ₹10,000 / ₹250 flat rate</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-200 pb-3">
                                <strong>Expedited (2 business days)</strong>
                                <span>₹900 flat rate</span>
                            </li>
                            <li className="flex justify-between pt-1">
                                <strong>Overnight (Next business day)</strong>
                                <span>₹1,500 flat rate</span>
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">3. International Shipping</h2>
                    <p className="mb-8">We offer international shipping to most countries worldwide. Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Timeless Finds is not responsible for these charges if they are applied and are your responsibility as the customer.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">4. How do I check the status of my order?</h2>
                    <p className="mb-8">When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
                </article>
            </div>
        </div>
    );
}
