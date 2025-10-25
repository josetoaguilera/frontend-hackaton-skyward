export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Skyward
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Born from the passion for innovation and the drive to make hackathons more accessible and productive for developers worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe that great ideas should be brought to life quickly and efficiently. 
              Skyward was created to eliminate the friction between concept and implementation, 
              allowing developers to focus on what matters most - building amazing solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform provides the tools, components, and infrastructure needed to 
              rapidly prototype and deploy applications, making it perfect for hackathons, 
              MVP development, and rapid iteration cycles.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projects Built</span>
                <span className="text-2xl font-bold text-primary-600">10,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Developers</span>
                <span className="text-2xl font-bold text-primary-600">5,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hackathons Won</span>
                <span className="text-2xl font-bold text-primary-600">500+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries Reached</span>
                <span className="text-2xl font-bold text-primary-600">50+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Skyward?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Setup</h3>
              <p className="text-gray-600">Get your project up and running in minutes, not hours.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competition Ready</h3>
              <p className="text-gray-600">Built specifically for hackathon environments and tight deadlines.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Tools</h3>
              <p className="text-gray-600">Latest technologies and best practices built right in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
