import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import { WHATSAPP_TIENDA, INSTAGRAM_TIENDA } from '../utils/contacto'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviado(true)
  }

  const mensajeWhatsApp = encodeURIComponent('Hola! Quería hacerte una consulta sobre URBX.')
  const urlWhatsApp = `https://wa.me/${WHATSAPP_TIENDA}?text=${mensajeWhatsApp}`
  const urlInstagram = `https://instagram.com/${INSTAGRAM_TIENDA}`

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="text-3xl font-bold text-dorado mb-3">Contacto</h1>
        <p className="text-gris mb-10 max-w-xl">
          ¿Tenés dudas sobre un producto o tu pedido? Escribinos y te
          respondemos a la brevedad.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-8">
        <FadeIn>
          {enviado ? (
            <div className="bg-carta border border-borde rounded-lg p-8 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c8a96e"
                strokeWidth="1.6"
                className="mx-auto mb-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12.5 11 15.5 16 9" />
              </svg>
              <p className="text-crema font-bold mb-2">¡Mensaje enviado!</p>
              <p className="text-gris text-sm">Te vamos a responder a la brevedad.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-carta border border-borde rounded-lg p-6 space-y-4"
            >
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
              />
              <textarea
                name="mensaje"
                placeholder="Tu mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-4">
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-carta border border-borde rounded-lg p-5 hover:border-dorado transition-colors"
            >
              <span className="w-11 h-11 border border-dorado rounded-full flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.6">
                  <path d="M7 17 4 20l1.2-3.6A8 8 0 1 1 7 17zM9 9.5c0 3 2.5 5.5 5.5 5.5" />
                </svg>
              </span>
              <div>
                <p className="text-crema font-medium">WhatsApp</p>
                <p className="text-gris text-sm">Respuesta rápida en horario comercial</p>
              </div>
            </a>

            <a
              href={urlInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-carta border border-borde rounded-lg p-5 hover:border-dorado transition-colors"
            >
              <span className="w-11 h-11 border border-dorado rounded-full flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#c8a96e" stroke="none" />
                </svg>
              </span>
              <div>
                <p className="text-crema font-medium">Instagram</p>
                <p className="text-gris text-sm">@{INSTAGRAM_TIENDA}</p>
              </div>
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
