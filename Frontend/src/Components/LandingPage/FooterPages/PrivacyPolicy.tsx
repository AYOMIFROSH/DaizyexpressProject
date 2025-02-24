import Footer from "../Footer";

const PrivacyPolicy = () => {
    return (
        <>
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-center text-gray-600 mb-6">Last updated: February 18, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to Deizy. Your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p className="leading-relaxed mt-2">
            By using our services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please refrain from using our website.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <p className="leading-relaxed">
            We may collect various types of personal information, including but not limited to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Your name, email address, and contact details</li>
            <li>Payment information for transactions</li>
            <li>Device and browsing information through cookies</li>
            <li>Location data if enabled on your device</li>
            <li>Communications with customer support</li>
            <li>Any other data you voluntarily provide</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We utilize your data to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Provide and enhance our services</li>
            <li>Process transactions securely</li>
            <li>Personalize user experience and provide recommendations</li>
            <li>Improve security and prevent fraudulent activities</li>
            <li>Analyze usage trends and improve functionality</li>
            <li>Comply with legal obligations</li>
            <li>Send promotional emails and updates (you may opt out anytime)</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Data Protection</h2>
          <p className="leading-relaxed">
            We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no online transmission is 100% secure, so we encourage you to take precautions such as using strong passwords and enabling two-factor authentication.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
          <p className="leading-relaxed">
            We may share your data with third-party service providers who assist in operations such as payment processing, analytics, and marketing. These parties are obligated to protect your information. We do not sell or rent your data to third parties.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Cookies & Tracking Technologies</h2>
          <p className="leading-relaxed">
            Our website uses cookies to enhance your experience. Cookies help us understand user preferences and improve website functionality. You can manage your cookie preferences in your browser settings. Disabling cookies may limit certain website functionalities.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Access, update, or delete your personal data</li>
            <li>Withdraw consent for data processing</li>
            <li>Request information about how your data is used</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="leading-relaxed mt-2">
            If you wish to exercise these rights, please contact us at <a href="mailto:support@deizy.com" className="text-blue-600 hover:underline">support@deizy.com</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Data Retention</h2>
          <p className="leading-relaxed">
            We retain your personal information as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law. You may request deletion of your data at any time.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We reserve the right to update this policy as needed. Any changes will be reflected on this page with an updated revision date. We encourage users to review this page periodically.
          </p>
        </section>
      </div>
      <Footer/>
      </>
    );
  };
  
  export default PrivacyPolicy;