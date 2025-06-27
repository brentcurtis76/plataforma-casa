import Link from 'next/link'

function Footer() {
  const navigation = {
    main: [
      { name: 'Inicio', href: '#' },
      { name: 'Propósito', href: '#proposito' },
      { name: 'Equipo', href: '#equipo' },
      { name: 'Eventos', href: '#eventos' },
    ],
    social: [
      { name: 'Instagram', href: '#' },
      { name: 'Facebook', href: '#' },
      { name: 'YouTube', href: '#' },
    ],
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-light mb-6 tracking-wide" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>CASA</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Un lugar de amor incondicional y gracia transformadora.
            </p>
            <div className="w-16 h-px bg-white opacity-50"></div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-gray-400">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-all duration-200 relative group inline-block"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-200 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-gray-400">
              Horarios
            </h4>
            <div className="space-y-4">
              <div className="text-gray-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Domingo</span>
                  <span className="text-white">10:00 AM</span>
                </div>
                <span className="text-xs text-gray-400">Servicio Principal</span>
              </div>
              <div className="text-gray-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Miércoles</span>
                  <span className="text-white">7:00 PM</span>
                </div>
                <span className="text-xs text-gray-400">Estudio Bíblico</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-gray-400">
              Contacto
            </h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-xs mt-1">📍</span>
                <span>Santiago, Chile</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs mt-1">📧</span>
                <a href="mailto:info@casa.cl" className="hover:text-white transition-colors hover:underline">
                  info@casa.cl
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs mt-1">📞</span>
                <span>+56 9 1234 5678</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CASA. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <span className="sr-only">{item.name}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }