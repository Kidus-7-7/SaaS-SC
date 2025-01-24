export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">About Addis Bete</h1>
          <p className="mt-4 text-lg text-gray-600">Your trusted real estate platform in Ethiopia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To revolutionize the Ethiopian real estate market by providing a transparent, 
                efficient, and user-friendly platform that connects property seekers with the 
                best opportunities in the market.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the leading real estate platform in Ethiopia, known for innovation, 
                reliability, and exceptional service in connecting people with their perfect properties.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Transparency in all our dealings</li>
                <li>Excellence in service delivery</li>
                <li>Innovation in real estate solutions</li>
                <li>Integrity in business practices</li>
                <li>Customer satisfaction as our priority</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Comprehensive Listings</h3>
                  <p className="text-gray-600">Access to a wide range of properties across Ethiopia</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Verified Agents</h3>
                  <p className="text-gray-600">Work with trusted and experienced real estate professionals</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Market Insights</h3>
                  <p className="text-gray-600">Stay informed with the latest real estate trends and data</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Secure Platform</h3>
                  <p className="text-gray-600">Safe and secure property transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}