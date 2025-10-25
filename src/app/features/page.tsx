export default function Features() {
  const features = [
    {
      title: "⚡ Lightning Fast Performance",
      description: "Built with Next.js 14 and optimized for speed with automatic code splitting and server-side rendering.",
      benefits: [
        "Sub-second page loads",
        "Automatic image optimization", 
        "Edge runtime support",
        "Built-in performance monitoring"
      ]
    },
    {
      title: "🎨 Modern Design System",
      description: "Beautiful, responsive UI components built with Tailwind CSS and Framer Motion animations.",
      benefits: [
        "Mobile-first responsive design",
        "Dark mode support",
        "Smooth animations and transitions",
        "Consistent design tokens"
      ]
    },
    {
      title: "🛠️ Developer Experience",
      description: "Optimized for rapid development with TypeScript, hot reload, and comprehensive tooling.",
      benefits: [
        "TypeScript for type safety",
        "Hot module replacement",
        "ESLint and Prettier configured",
        "VS Code integration"
      ]
    },
    {
      title: "🚀 Deployment Ready",
      description: "One-click deployment to Vercel, Netlify, or any modern hosting platform.",
      benefits: [
        "Automatic CI/CD setup",
        "Environment variable management",
        "Performance analytics",
        "Global CDN distribution"
      ]
    },
    {
      title: "📱 Cross-Platform",
      description: "Works seamlessly across all devices and browsers with progressive web app capabilities.",
      benefits: [
        "PWA support",
        "Offline functionality",
        "Push notifications",
        "App-like experience"
      ]
    },
    {
      title: "🔐 Built-in Security",
      description: "Security best practices implemented out of the box with modern web standards.",
      benefits: [
        "HTTPS by default",
        "Content Security Policy",
        "XSS protection",
        "Secure headers"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Modern Development
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale your hackathon project. 
            From development to production, we've got you covered with industry-leading tools and practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Built with Modern Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "Next.js", color: "text-black" },
              { name: "TypeScript", color: "text-blue-600" },
              { name: "Tailwind CSS", color: "text-cyan-500" },
              { name: "Framer Motion", color: "text-pink-500" },
              { name: "React", color: "text-blue-400" },
              { name: "Vercel", color: "text-gray-900" }
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className={`text-2xl font-bold ${tech.color} mb-2`}>
                  {tech.name}
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your next hackathon project with confidence using our feature-rich platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Get Started Free
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
