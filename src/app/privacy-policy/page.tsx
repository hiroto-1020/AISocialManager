import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-gray-300 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        NextPost ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Account Information:</strong> When you register, we collect your email address and authentication details.</li>
                        <li><strong>Social Media Credentials:</strong> To function, our app requires access to your Twitter (X) account credentials. These are encrypted and stored securely.</li>
                        <li><strong>Usage Data:</strong> We may collect anonymous data about how you use the app to improve our services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                    <p className="mb-4">We use your information solely for the purpose of providing the NextPost service, which includes:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Automating social media posts based on your settings.</li>
                        <li>Analyzing trends to generate relevant content.</li>
                        <li>Managing your scheduled posts.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">4. Data Sharing</h2>
                    <p className="mb-4">
                        We do not sell or share your personal data with third parties, except as required to function (e.g., communicating with the Twitter API).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-12">Last updated: November 2025</p>
            </div>
        </div>
    );
}
