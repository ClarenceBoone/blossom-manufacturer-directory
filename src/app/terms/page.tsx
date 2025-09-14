import Header from '@/components/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 1, 2025
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of the Blossom platform 
                  and services provided by Blossom Haus Studios ("Company," "we," "our," or "us"). 
                  By accessing or using our services, you agree to be bound by these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Services</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Blossom is a platform that connects brands and businesses with manufacturers worldwide. 
                  Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Manufacturer directory and search functionality</li>
                  <li>Communication tools between brands and manufacturers</li>
                  <li>AI-powered matching and recommendation services</li>
                  <li>Project management and collaboration tools</li>
                  <li>Quality verification and rating systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts and Registration</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Take responsibility for all activities under your account</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree not to use our services to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Use automated tools to scrape or harvest data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Manufacturer Relationships</h2>
                <p className="text-gray-600 leading-relaxed">
                  Blossom facilitates connections between brands and manufacturers but is not a party to 
                  any agreements between users. We do not guarantee the quality, reliability, or 
                  performance of any manufacturer or the success of any business relationship formed 
                  through our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content and Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Users retain ownership of content they submit but grant Blossom a license to use, 
                  modify, and display such content in connection with our services. Our platform, 
                  including software, designs, and trademarks, remains our intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Our collection and use of personal information is 
                  governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment and Fees</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Some services may require payment of fees. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Pay all applicable fees in a timely manner</li>
                  <li>Provide accurate billing information</li>
                  <li>Accept responsibility for all charges incurred</li>
                  <li>Comply with our refund and cancellation policies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers and Limitations</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are provided "as is" without warranties of any kind. We disclaim all 
                  warranties, express or implied, including merchantability and fitness for a particular 
                  purpose. Our liability is limited to the maximum extent permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify and hold harmless Blossom and its affiliates from any claims, 
                  damages, or expenses arising from your use of our services or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may terminate or suspend your access to our services at any time for any reason, 
                  including violation of these Terms. You may also terminate your account at any time 
                  by contacting us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of the State of 
                  California, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will provide notice of 
                  material changes and your continued use constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@blossom.co<br />
                    <strong>Address:</strong> 123 Fashion District, Los Angeles, CA 90015<br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}