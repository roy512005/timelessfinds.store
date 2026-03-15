export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Effective Date: January 1, 2024</p>
                </header>

                <article className="prose prose-gray max-w-none text-gray-600 leading-relaxed font-serif">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">1. Information We Collect</h2>
                    <p className="mb-8">Timeless Finds collects information that you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include your name, email address, postal address, phone number, and payment information.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">2. How We Use Your Information</h2>
                    <p className="mb-4">We use the information we collect to:</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-8 font-sans">
                        <ul className="space-y-3 m-0 p-0 list-disc pl-4 text-gray-700">
                            <li>Process and fulfill your orders, including completing payments and delivering products.</li>
                            <li>Communicate with you about your account, orders, and inquiries.</li>
                            <li>Send you marketing communications, if you have opted in.</li>
                            <li>Improve our website, products, and services based on usage data.</li>
                            <li>Detect and prevent fraud or security incidents.</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">3. Information Sharing</h2>
                    <p className="mb-8">We do not sell your personal information. We may share your information with trusted third-party service providers who help us operate our business, such as payment processors, shipping carriers, and marketing platforms. These providers are obligated to protect your data and only use it for the intended purposes.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">4. Security</h2>
                    <p className="mb-8">We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of your data.</p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">5. Your Rights</h2>
                    <p className="mb-8">Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact our privacy officer at privacy@timelessfinds.com.</p>
                </article>
            </div>
        </div>
    );
}
