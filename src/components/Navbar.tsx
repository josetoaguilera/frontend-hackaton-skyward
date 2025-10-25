'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  className?: string
}

const Navbar = ({ className = '' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600">Skyward</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600 inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a href="#home" className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </a>
            <a href="#features" className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
            <button className="w-full text-left bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
