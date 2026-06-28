import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import FadeIn from './FadeIn'

const INTERVALO_MS = 3000

export default function Hero({ productos = [] }) {
  const imagenes = productos.filter((p) => p.imagen).map((p) => p.imagen)
  const tieneImagenes = imagenes.length > 0

  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (!tieneImagenes) return
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % imagenes.length)
    }, INTERVALO_MS)
    return () => clearInterval(intervalo)
  }, [tieneImagenes, imagenes.length])

  function irAnterior() {
    setIndice((i) => (i - 1 + imagenes.length) % imagenes.length)
  }

  function irSiguiente() {
    setIndice((i) => (i + 1) % imagenes.length)
  }

  return (
    <section className="bg-oscuro border-b border-borde">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
        <div>
          <FadeIn>
            <p className="text-[11px] tracking-[0.25em] text-gris mb-5">
              NUEVA COLECCIÓN 2025
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-crema mb-6">
              DEFINE TU <span className="text-dorado">ESTILO</span> URBANO
            </h1>
            <p className="text-gris text-base max-w-md mb-9">
              Prendas diseñadas para la calle. Calidad premium, cortes modernos
              y una identidad que no pasa desapercibida.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Link
              to="/catalogo"
              className="relative inline-block overflow-hidden group bg-dorado text-oscuro text-sm font-bold tracking-[0.15em] px-8 py-4 hover:opacity-90 transition-opacity"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">VER COLECCIÓN</span>
            </Link>
          </FadeIn>
        </div>

        <div
          className={`relative overflow-hidden aspect-[4/5] ${
            tieneImagenes ? '' : 'bg-carta border border-borde flex items-center justify-center'
          }`}
        >
          <span className="absolute top-5 right-5 bg-dorado text-oscuro text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 z-20">
            NEW DROP
          </span>

          {tieneImagenes ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={indice}
                  src={imagenes[indice]}
                  alt="Producto destacado"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={irAnterior}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-oscuro/60 text-crema hover:bg-oscuro transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18 9 12l6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={irSiguiente}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-oscuro/60 text-crema hover:bg-oscuro transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {imagenes.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndice(i)}
                    aria-label={`Ir a la imagen ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === indice ? 'bg-dorado' : 'bg-crema/30'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1">
              <path d="M8 4 4 8v12h16V8l-4-4" />
              <path d="M8 4a4 4 0 0 0 8 0" />
            </svg>
          )}
        </div>
      </div>
    </section>
  )
}
