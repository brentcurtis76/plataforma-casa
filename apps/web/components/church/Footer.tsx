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
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">CASA</h3>
            <p className="text-gray-300 text-sm">
              Un lugar de amor incondicional y gracia transformadora.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Horarios
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                <span className="font-medium">Domingo:</span> 10:00 AM
                <span className="block text-xs">Servicio Principal</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Santiago, Chile</li>
              <li>
                <a href="mailto:info@casa.cl" className="hover:text-white transition-colors">
                  info@casa.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CASA. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <span className="text-sm">{item.name}</span>
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