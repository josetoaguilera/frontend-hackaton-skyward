import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Emergencias 1619 - Registro y Gestión',
  description: 'Plataforma integral para gestionar emergencias. Registra tu información médica y de contacto para recibir asistencia rápida cuando más lo necesites.',
  keywords: 'emergencias, 1619, sistema de emergencias, salud, seguridad, primeros auxilios',
  authors: [{ name: 'Sistema 1619' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
