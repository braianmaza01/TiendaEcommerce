import { Link } from 'react-router-dom'
import FadeIn from './FadeIn'

const enlacesTienda = ['Nueva Colección', 'Hombre', 'Mujer', 'Accesorios', 'Promociones']

const enlacesInfo = [
  { label: 'Sobre Nosotros', to: '/sobre-nosotros' },
  { label: 'Cómo comprar', to: '/como-comprar' },
  { label: 'Retiro en local', to: '/retiro-en-local' },
  { label: 'Envíos', to: '/envios' },
  { label: 'Contacto', to: '/contacto' },
]

const redes = [
  {
    nombre: 'Instagram',
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    nombre: 'TikTok',
    icono: (
      <path d="M16 3v10.5a3.5 3.5 0 1 1-3.5-3.5M16 3a5 5 0 0 0 5 5" />
    ),
  },
  {
    nombre: 'WhatsApp',
    icono: (
      <path d="M7 17 4 20l1.2-3.6A8 8 0 1 1 7 17zM9 9.5c0 3 2.5 5.5 5.5 5.5" />
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-negro2 border-t border-borde">
      <FadeIn>
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-xl font-bold tracking-[0.3em] text-crema mb-4">URBX</p>
            <p className="text-gris text-sm max-w-xs mb-6">
              Streetwear urbano con identidad propia. Calidad premium para los
              que marcan tendencia.
            </p>
            <div className="flex gap-3">
              {redes.map((red) => (
                <a
                  key={red.nombre}
                  href="#"
                  aria-label={red.nombre}
                  className="w-9 h-9 border border-borde flex items-center justify-center text-gris hover:border-dorado hover:text-dorado transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {red.icono}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] text-gris2 mb-5">TIENDA</p>
            <ul className="space-y-3">
              {enlacesTienda.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gris text-sm hover:text-dorado transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] text-gris2 mb-5">INFORMACIÓN</p>
            <ul className="space-y-3">
              {enlacesInfo.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gris text-sm hover:text-dorado transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      <div className="border-t border-borde">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-gris2 text-xs">
            © {new Date().getFullYear()} URBX · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
