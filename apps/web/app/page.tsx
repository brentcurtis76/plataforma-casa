import { Header } from '@/components/church/Header'
import { ModernHero } from '@/components/church/ModernHero'
import { Footer } from '@/components/church/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-0">
        <ModernHero />
        
        {/* Sentido & Propósito */}
        <section id="proposito" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-[4/3] overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-xl font-light text-gray-800">Propósito</h3>
                      <p className="text-sm text-gray-600">Transformando vidas con amor</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
                  Sentido & Propósito
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Crear una comunidad donde cada persona pueda experimentar el amor incondicional de Dios 
                  y crecer en su relación espiritual en un ambiente de respeto y diversidad. Un espacio 
                  donde la fe se vive con autenticidad y la esperanza se comparte con generosidad.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-black"></div>
                  <span className="text-sm text-gray-500">Nuestra misión</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipo & Liderazgo */}
        <section id="equipo" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                Equipo & Liderazgo
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conoce a las personas que hacen posible nuestra misión y visión comunitaria.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4 group">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg aspect-[3/4] overflow-hidden relative hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-3xl">🙏</span>
                      </div>
                      <div className="px-4">
                        <h4 className="font-medium text-gray-800 mb-2">Liderazgo</h4>
                        <p className="text-xs text-gray-600">Guía espiritual con sabiduría y compasión</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">Liderazgo Pastoral</h3>
                  <p className="text-sm text-gray-600">Guía espiritual</p>
                </div>
              </div>
              
              <div className="space-y-4 group">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg aspect-[3/4] overflow-hidden relative hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-3xl">📚</span>
                      </div>
                      <div className="px-4">
                        <h4 className="font-medium text-gray-800 mb-2">Formación</h4>
                        <p className="text-xs text-gray-600">Crecimiento continuo en la fe</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">Equipo de Formación</h3>
                  <p className="text-sm text-gray-600">Crecimiento espiritual</p>
                </div>
              </div>
              
              <div className="space-y-4 group">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg aspect-[3/4] overflow-hidden relative hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-3xl">🤝</span>
                      </div>
                      <div className="px-4">
                        <h4 className="font-medium text-gray-800 mb-2">Comunidad</h4>
                        <p className="text-xs text-gray-600">Unidos en amor y servicio</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">Comunidad</h3>
                  <p className="text-sm text-gray-600">Vida en comunidad</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formación */}
        <section id="formacion" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
                  Invitamos en nuestro espacio formativo, reencontrando lo sagrado
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Un espacio dedicado al crecimiento personal y espiritual, donde cada persona puede 
                  explorar y profundizar su relación con lo divino a través de diversas actividades 
                  y enseñanzas que nutren el alma.
                </p>
                <button className="inline-flex items-center px-8 py-3 border border-black text-sm font-medium rounded-none text-black bg-white hover:bg-gray-50 transition-colors">
                  Conoce más
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg aspect-[4/3] overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 p-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-4xl">📖</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-800 mb-3">Formación Espiritual</h4>
                      <p className="text-sm text-gray-600">Descubre lo sagrado en tu vida diaria</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Participa */}
        <section id="participar" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg aspect-[4/3] overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-4xl">🌅</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-gray-800 mb-3">Retiro Espiritual</h4>
                        <p className="text-sm text-gray-600">Renovación en Semana Santa</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
                  Participa en nuestro retiro de Semana Santa
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Una experiencia transformadora de reflexión y renovación espiritual en un ambiente 
                  de paz y contemplación. Únete a nosotros en este tiempo especial de crecimiento 
                  y conexión comunitaria.
                </p>
                <button className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-none text-white bg-black hover:bg-gray-800 transition-colors">
                  Inscríbete
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Eventos */}
        <section id="eventos" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                Próximos Eventos
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Domingo</p>
                    <p className="text-2xl font-light">24</p>
                    <p className="text-sm text-gray-500">Diciembre</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">EVENTO</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Celebración de Navidad</h3>
                <p className="text-sm text-gray-600">Únete a nuestra celebración especial de Navidad.</p>
              </div>
              
              <div className="border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Domingo</p>
                    <p className="text-2xl font-light">31</p>
                    <p className="text-sm text-gray-500">Diciembre</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">ESPECIAL</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Despedida del Año</h3>
                <p className="text-sm text-gray-600">Reflexión y gratitud por el año que termina.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}