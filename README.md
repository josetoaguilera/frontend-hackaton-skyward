# Sistema de Emergencias 911 - Frontend

Aplicación web moderna para la gestión de emergencias que permite a los usuarios registrar su información médica y de contacto para recibir asistencia rápida durante emergencias.

## Características Principales

- 🚨 **Sistema de Emergencias 911** completo
- 👤 **Registro y Autenticación** de usuarios
- � **Gestión de Información Médica** (alergias, medicamentos, condiciones)
- 📞 **Información de Contactos de Emergencia**
- �️ **Geolocalización** para ubicación precisa
- 📱 **Diseño Responsive** optimizado para móviles
- � **Seguridad** con protección de rutas y datos
- ⚡ **Interfaz Rápida** construida con Next.js 14

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd frontend-hackaton-skyward
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── about/             # About page
├── components/            # Reusable components
│   └── Navbar.tsx        # Navigation component
└── lib/                   # Utility functions
    └── utils.ts          # Helper utilities
```

## Páginas Principales

- **Inicio (/)**: Página principal con información del sistema y enlaces de acceso
- **Registro (/register)**: Formulario completo de registro con validaciones
- **Login (/login)**: Inicio de sesión seguro
- **Dashboard (/dashboard)**: Panel de control con estadísticas y gestión de solicitudes
- **Nueva Solicitud (/emergency-request)**: Formulario para crear solicitudes de emergencia
- **Acerca de (/about)**: Información sobre el sistema y estadísticas

## Styling

This project uses Tailwind CSS for styling with a custom color palette:

- Primary colors: Blue gradient (blue-50 to blue-900)
- Modern glassmorphism effects
- Responsive design patterns
- Custom animations and transitions

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com):

```bash
npm run build
```

Or deploy with Vercel CLI:

```bash
npx vercel
```

## Customization

### Colors
Edit the color palette in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### Components
Add new components in the `src/components` directory and import them where needed.

### Pages
Add new pages in the `src/app` directory following Next.js 14 App Router conventions.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
