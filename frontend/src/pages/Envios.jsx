import FadeIn from '../components/FadeIn'
import { WHATSAPP_TIENDA } from '../utils/contacto'

export default function Envios() {
  const mensaje = encodeURIComponent('Hola! Quería consultar por un envío de un pedido URBX.')
  const urlWhatsApp = `https://wa.me/${WHATSAPP_TIENDA}?text=${mensaje}`

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="text-3xl font-bold text-dorado mb-3">Envíos</h1>
        <p className="text-gris mb-10 max-w-xl">
          Hacemos envíos a todo el país a través de Correo Argentino y empresas
          de logística privadas.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <FadeIn>
          <div className="bg-carta border border-borde rounded-lg p-6 text-center">
            <p className="text-gris2 text-xs tracking-[0.15em] mb-2">COBERTURA</p>
            <p className="text-crema font-bold">Todo el país</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="bg-carta border border-borde rounded-lg p-6 text-center">
            <p className="text-gris2 text-xs tracking-[0.15em] mb-2">TIEMPO ESTIMADO</p>
            <p className="text-crema font-bold">3 a 7 días hábiles</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="bg-carta border border-borde rounded-lg p-6 text-center">
            <p className="text-gris2 text-xs tracking-[0.15em] mb-2">COSTO</p>
            <p className="text-crema font-bold">Desde $3.500</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <div className="bg-carta border border-borde rounded-lg p-6">
          <p className="text-crema font-medium mb-2">¿Cómo se coordina?</p>
          <p className="text-gris text-sm mb-5">
            Una vez confirmado tu pedido en el checkout, te contactamos por
            WhatsApp para coordinar el envío y confirmar el costo final según
            tu ubicación.
          </p>
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-dorado text-oscuro font-bold text-sm px-6 py-3 rounded hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 17 4 20l1.2-3.6A8 8 0 1 1 7 17zM9 9.5c0 3 2.5 5.5 5.5 5.5" />
            </svg>
            Coordinar envío por WhatsApp
          </a>
        </div>
      </FadeIn>
    </div>
  )
}
