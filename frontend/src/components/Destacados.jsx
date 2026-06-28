import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import FadeIn from './FadeIn'

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000

const filtros = [
  { label: 'TODOS', valor: 'todos' },
  { label: 'HOMBRE', valor: 'hombre' },
  { label: 'MUJER', valor: 'mujer' },
  { label: 'NUEVO', valor: 'nuevo' },
  { label: 'PROMOCIONES', valor: 'promociones' },
]

const contenedorVariantes = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariantes = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Destacados({ productos = [], cargando = false }) {
  const [filtro, setFiltro] = useState('todos')

  const filtrados = productos.filter((p) => {
    if (filtro === 'todos') return true
    if (filtro === 'nuevo') {
      return Date.now() - new Date(p.createdAt).getTime() <= TREINTA_DIAS_MS
    }
    if (filtro === 'promociones') return Boolean(p.enPromocion)
    return (p.genero || '').toLowerCase() === filtro
  })

  return (
    <section className="bg-oscuro">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <FadeIn>
          <h2 className="text-sm tracking-[0.25em] text-gris mb-8">DESTACADOS</h2>

          <div className="flex flex-wrap gap-6 mb-10 border-b border-borde pb-5">
            {filtros.map((f) => (
              <button
                key={f.valor}
                onClick={() => setFiltro(f.valor)}
                className={`text-xs tracking-[0.15em] transition-colors ${
                  filtro === f.valor
                    ? 'text-dorado'
                    : 'text-gris hover:text-crema'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {cargando ? (
          <p className="text-gris2 text-sm">Cargando productos...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gris2 text-sm">No hay productos en esta categoría.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={contenedorVariantes}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {filtrados.map((producto) => (
              <motion.div key={producto._id} variants={itemVariantes}>
                <ProductCard producto={producto} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
