import FadeIn from './FadeIn'

export default function BannerRetiro() {
  return (
    <section className="bg-carta border-y border-borde">
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-crema tracking-wide mb-4">
            RETIRO EN LOCAL
          </h2>
          <p className="text-gris max-w-lg mx-auto mb-8">
            Reservá tu pedido online y retiralo sin costo de envío en nuestro
            local. Listo en 24hs hábiles.
          </p>
          <button
            type="button"
            className="relative inline-block overflow-hidden group border border-dorado text-dorado text-sm font-bold tracking-[0.15em] px-8 py-4 hover:bg-dorado hover:text-oscuro transition-colors"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative">VER UBICACIÓN</span>
          </button>
        </FadeIn>
      </div>
    </section>
  )
}
