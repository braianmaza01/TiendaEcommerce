import FadeIn from '../components/FadeIn'
import { WHATSAPP_TIENDA, DIRECCION_LOCAL } from '../utils/contacto'

const HORARIOS = [
  { dia: 'Lunes a Viernes', horario: '10:00 a 19:00 hs' },
  { dia: 'Sábados', horario: '10:00 a 14:00 hs' },
  { dia: 'Domingos', horario: 'Cerrado' },
]

export default function RetiroEnLocal() {
  const mensaje = encodeURIComponent(
    'Hola! Quería consultar sobre el retiro en local de un pedido URBX.'
  )
  const urlWhatsApp = `https://wa.me/${WHATSAPP_TIENDA}?text=${mensaje}`

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="text-3xl font-bold text-dorado mb-3">Retiro en local</h1>
        <p className="text-gris mb-10 max-w-xl">
          Reservá tu pedido online y retiralo sin costo de envío en nuestro
          local. Te avisamos por email o WhatsApp cuando esté listo.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-8">
        <FadeIn>
          <div className="bg-carta border border-borde rounded-lg overflow-hidden h-full">
            <div className="aspect-[4/3] bg-oscuro flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.4">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21c-4-4.5-7-8-7-11a7 7 0 1 1 14 0c0 3-3 6.5-7 11z" />
              </svg>
            </div>
            <div className="p-5">
              <p className="text-crema font-medium mb-1">Dirección del local</p>
              <p className="text-gris text-sm">{DIRECCION_LOCAL}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-carta border border-borde rounded-lg p-6 h-full flex flex-col">
            <p className="text-crema font-medium mb-4">Horarios de atención</p>
            <ul className="space-y-3 text-sm flex-1">
              {HORARIOS.map((h) => (
                <li key={h.dia} className="flex justify-between text-gris">
                  <span>{h.dia}</span>
                  <span className="text-crema">{h.horario}</span>
                </li>
              ))}
            </ul>

            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-dorado text-oscuro font-bold text-sm px-6 py-3 rounded hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 17 4 20l1.2-3.6A8 8 0 1 1 7 17zM9 9.5c0 3 2.5 5.5 5.5 5.5" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
