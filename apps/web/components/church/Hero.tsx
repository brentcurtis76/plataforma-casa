'use client'

import { MapPin, MoveRight } from 'lucide-react'

function Hero() {
  const scrollToParticipar = () => {
    const participarSection = document.getElementById('participar')
    if (participarSection) {
      participarSection.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="w-full pt-24 pb-16 bg-white" aria-labelledby="hero-heading">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-black rounded-full"></div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                  Bienvenido
                </div>
              </div>
              
              <div className="space-y-8">
                <h1 
                  id="hero-heading" 
                  className="text-5xl lg:text-6xl xl:text-7xl leading-[0.9] text-left font-light text-gray-900 max-w-lg"
                  style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}
                >
                  Un espacio de amor, inclusión y esperanza para todos
                </h1>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-16 h-px bg-black"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 border border-black rounded-full flex items-center justify-center">
                      <span className="text-xs font-light" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>ca</span>
                    </div>
                    <div className="w-10 h-10 border border-black rounded-full flex items-center justify-center">
                      <span className="text-xs font-light" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>sa</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row gap-4 pt-6">
                <button
                  onClick={scrollToParticipar}
                  className="px-6 py-3 text-xs uppercase tracking-wider text-white bg-black hover:bg-gray-800 transition-colors font-light"
                  style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}
                >
                  Conoce más
                </button>
                <button 
                  className="px-6 py-3 text-xs uppercase tracking-wider text-black border border-black hover:bg-gray-50 transition-colors font-light"
                  style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}
                >
                  Visítanos
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
                  <img 
                    src="https://github.com/brentcurtis76/casa-web/raw/main/public/lovable-uploads/105a46c3-8fe4-429c-af7d-79a85edc4694.png" 
                    alt="Comunidad CASA" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.style.background = '#f3f4f6';
                    }}
                  />
                </div>
                <div className="bg-gray-100 aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://github.com/brentcurtis76/casa-web/raw/main/public/lovable-uploads/10870cef-f487-456b-8140-5c04bf8e4312.png" 
                    alt="Actividades CASA" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.style.background = '#f3f4f6';
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-gray-100 aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://github.com/brentcurtis76/casa-web/raw/main/public/lovable-uploads/21aa90bf-b80c-4395-b5ee-43cec866068a.png" 
                    alt="Eventos CASA" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.style.background = '#f3f4f6';
                    }}
                  />
                </div>
                <div className="bg-gray-100 aspect-[3/4] overflow-hidden">
                  <img 
                    src="https://github.com/brentcurtis76/casa-web/raw/main/public/lovable-uploads/bf6c1e04-3fd7-40a9-b894-ee52b07cd7ae.png" 
                    alt="Formación CASA" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.style.background = '#f3f4f6';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }