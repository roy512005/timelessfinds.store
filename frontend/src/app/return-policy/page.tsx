export default function ReturnPolicyPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Returns & Exchanges</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Effective Date: January 1, 2024</p>
                </header>

                <article className="prose prose-gray max-w-none text-gray-600 leading-relaxed font-serif">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Our Commitment</h2>
                    <p className="mb-8">We want you to be completely satisfied with your purchase from Timeless Finds. If for any reason you are not satisfied, we will gladly accept returns of unworn, unwashed, and unaltered merchandise with all tags attached within 14 days of delivery.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Return Process</h2>
                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-6 mb-8 font-sans">
                        <ol className="space-y-4 m-0 p-0 list-decimal pl-4">
                            <li className="pl-2">
                                <strong>Request a Return:</strong> Navigate to your Account Dashboard or our Returns Portal to initiate a request.
                            </li>
                            <li className="pl-2">
                                <strong>Print Label:</strong> Once approved, print the provided prepaid shipping label.
                            </li>
                            <li className="pl-2">
                                <strong>Package Securely:</strong> Ensure all original tags and packaging are included.
                            </li>
                            <li className="pl-2">
                                <strong>Drop Off:</strong> Leave your package at any authorized carrier location.
                            </li>
                        </ol>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Refunds</h2>
                    <p className="mb-8">Once your return is received and inspected, we will send an email to notify you of the approval or rejection of your refund. Approved refunds will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days. Original shipping fees are non-refundable.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Exchanges</h2>
                    <p className="mb-8">If you need a different size or color, we recommend placing a new order for the desired item and returning your original purchase for a refund via the standard process. Direct exchanges are subject to inventory availability.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Final Sale Items</h2>
                    <p className="mb-8">Items marked as "Final Sale" or discounted at 40% or more cannot be returned or exchanged. Custom garments and altered pieces are also non-refundable.</p>
                </article>
            </div>
        </div>
    );
}
