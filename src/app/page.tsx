'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Shield, AlertTriangle, Users, Heart } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

const features = [
  {
    icon: Phone,
    title: 'Llamadas de Emergencia',
    description: 'Sistema integrado para gestionar llamadas de emergencia 1619 de manera eficiente y rápida.'
  },
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    description: 'Protección de datos personal y médica con los más altos estándares de seguridad.'
  },
  {
    icon: Users,
    title: 'Equipo de Respuesta',
    description: 'Coordinación efectiva entre operadores, paramédicos y servicios de emergencia.'
  },
  {
    icon: Heart,
    title: 'Información Médica',
    description: 'Acceso rápido a historial médico, alergias y contactos de emergencia del usuario.'
  }
]

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (apiClient.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-6 py-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-red-600 flex items-center"
          >
            <Phone className="h-8 w-8 mr-2" />
            Sistema 1619
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors">
              Acerca de
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-red-600 transition-colors">
              Características
            </Link>
            <Link href="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Iniciar Sesión
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-bold text-gray-900 mb-6"
          >
            Sistema de Emergencias{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              1619
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Plataforma integral para la gestión de emergencias que conecta a ciudadanos con servicios de respuesta rápida. 
            Registra tu información médica y de contacto para recibir asistencia inmediata cuando más lo necesites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-4"
          >
            <Link href="/register" className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
              <span>Registrarse</span>
              <ArrowRight size={20} />
            </Link>
            
            <Link href="/login" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Iniciar Sesión
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características del Sistema
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde el registro de información hasta la respuesta de emergencia, nuestro sistema 
              está diseñado para salvar vidas con tecnología de vanguardia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para registrarte en nuestro sistema?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Únete a miles de usuarios que ya confían en nuestro sistema de emergencias para su seguridad.
            </p>
            <Link href="/register" className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-block">
              Registrarse Ahora
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 flex items-center justify-center">
            <Phone className="h-6 w-6 mr-2" />
            Sistema 1619
          </div>
          <p className="text-gray-400 mb-8">
            Tecnología que salva vidas, cuando cada segundo cuenta.
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>

      {/* Emergency Alert - Fixed Position */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-bold">¿EMERGENCIA REAL?</p>
            <p>Si estás en peligro inmediato, llama directamente al 1619 desde tu teléfono.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
