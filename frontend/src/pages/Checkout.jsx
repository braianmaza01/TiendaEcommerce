import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../utils/formato'
import { WHATSAPP_TIENDA, DIRECCION_LOCAL } from '../utils/contacto'
import { API_URL } from '../utils/api'

export default function Checkout() {
  const { items, total, vaciarCarrito } = useCarrito()

  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '' })
  const [tipoEntrega, setTipoEntrega] = useState('retiro')
  const [direccionEnvio, setDireccionEnvio] = useState({
    calle: '',
    numero: '',
    piso: '',
    ciudad: '',
    provincia: '',
  })
  const [metodoPago, setMetodoPago] = useState('efectivo')

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)

  function handleChangeDatos(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  function handleChangeDireccion(e) {
    setDireccionEnvio({ ...direccionEnvio, [e.target.name]: e.target.value })
  }

  function validar() {
    if (!datos.nombre.trim() || !datos.email.trim() || !datos.telefono.trim()) {
      return 'Completá tus datos personales.'
    }
    if (tipoEntrega === 'envio') {
      const { calle, numero, ciudad, provincia } = direccionEnvio
      if (!calle.trim() || !numero.trim() || !ciudad.trim() || !provincia.trim()) {
        return 'Completá los datos de envío.'
      }
    }
    return null
  }

  function construirMensajeWhatsApp() {
    const lineasProductos = items
      .map(
        (item) =>
          `• ${item.nombre} - Talla: ${item.talla} - Cantidad: ${item.cantidad} - $${item.precio.toLocaleString('es-AR')}`
      )
      .join('\n')

    const lineasEntrega =
      tipoEntrega === 'envio'
        ? `Envío a domicilio\nDirección: ${direccionEnvio.calle} ${direccionEnvio.numero}${
            direccionEnvio.piso ? `, ${direccionEnvio.piso}` : ''
          }, ${direccionEnvio.ciudad}, ${direccionEnvio.provincia}`
        : `Retiro en local\nDirección del local: ${DIRECCION_LOCAL}`

    const lineaPago =
      metodoPago === 'transferencia'
        ? 'Transferencia bancaria'
        : metodoPago === 'mercadopago'
          ? 'Tarjeta / Mercado Pago'
          : 'Efectivo al retirar/recibir'

    return `🛍️ Nuevo pedido URBX

*Cliente*
Nombre: ${datos.nombre}
Email: ${datos.email}
Teléfono: ${datos.telefono}

*Productos*
${lineasProductos}

*Entrega*
${lineasEntrega}

*Método de pago*
${lineaPago}

*Total: $${total.toLocaleString('es-AR')}*`
  }

  function construirUrlWhatsApp() {
    const mensaje = construirMensajeWhatsApp()
    return `https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(mensaje)}`
  }

  function abrirWhatsApp(whatsappUrl) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = whatsappUrl
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const mensajeError = validar()
    if (mensajeError) {
      setError(mensajeError)
      return
    }

    setEnviando(true)
    setError(null)

    const urlWhatsApp = construirUrlWhatsApp()

    try {
      const res = await axios.post(`${API_URL}/api/pedidos`, {
        cliente: datos,
        entrega: {
          tipo: tipoEntrega,
          ...(tipoEntrega === 'envio' ? direccionEnvio : {}),
        },
        metodoPago,
        productos: items.map((item) => ({
          producto: item._id,
          nombre: item.nombre,
          talla: item.talla,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total,
      })

      if (metodoPago === 'mercadopago') {
        const prefRes = await axios.post(`${API_URL}/api/pagos/crear-preferencia`, {
          items: items.map((item) => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
          comprador: datos,
          pedidoId: res.data._id,
        })
        window.location.href = prefRes.data.init_point
        return
      }

      abrirWhatsApp(urlWhatsApp)
      setPedidoConfirmado(res.data)
      vaciarCarrito()
    } catch {
      setError('No se pudo procesar el pedido. Intentá nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (pedidoConfirmado) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-crema">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c8a96e"
          strokeWidth="1.6"
          className="mx-auto mb-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12.5 11 15.5 16 9" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">¡Pedido confirmado!</h1>
        <p className="text-gris text-sm mb-1">
          Tu número de pedido es{' '}
          <span className="text-dorado font-bold">
            #{pedidoConfirmado._id.slice(-6).toUpperCase()}
          </span>
        </p>
        <p className="text-gris text-sm mb-8">
          Te contactaremos a {datos.email} para coordinar los próximos pasos.
        </p>
        <Link
          to="/"
          className="inline-block bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity"
        >
          Volver a la tienda
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-crema">
        <h1 className="text-2xl font-bold mb-4">No tenés productos en el carrito</h1>
        <Link to="/catalogo" className="text-dorado underline">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-dorado mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-carta border border-borde rounded-lg p-6">
            <h2 className="text-crema font-bold mb-4">Datos personales</h2>
            <div className="space-y-4">
              <input
                name="nombre"
                placeholder="Nombre completo"
                value={datos.nombre}
                onChange={handleChangeDatos}
                required
                className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={datos.email}
                  onChange={handleChangeDatos}
                  required
                  className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={datos.telefono}
                  onChange={handleChangeDatos}
                  required
                  className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          <section className="bg-carta border border-borde rounded-lg p-6">
            <h2 className="text-crema font-bold mb-4">Tipo de entrega</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipoEntrega('retiro')}
                className={`flex items-center gap-3 border rounded-lg p-4 text-left transition-colors ${
                  tipoEntrega === 'retiro'
                    ? 'border-dorado text-dorado'
                    : 'border-borde text-crema hover:border-gris'
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0">
                  <path d="M3 9 5 4h14l2 5" />
                  <path d="M4 9v10h16V9" />
                  <path d="M9 19v-5h6v5" />
                </svg>
                <span className="font-medium">Retiro en local</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoEntrega('envio')}
                className={`flex items-center gap-3 border rounded-lg p-4 text-left transition-colors ${
                  tipoEntrega === 'envio'
                    ? 'border-dorado text-dorado'
                    : 'border-borde text-crema hover:border-gris'
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0">
                  <rect x="1" y="7" width="13" height="9" rx="1" />
                  <path d="M14 10h4l3 3v3h-7z" />
                  <circle cx="6" cy="18" r="1.6" />
                  <circle cx="17" cy="18" r="1.6" />
                </svg>
                <span className="font-medium">Envío a domicilio</span>
              </button>
            </div>

            {tipoEntrega === 'retiro' && (
              <p className="text-gris text-sm mt-4">
                Retirás tu pedido en: <span className="text-crema">{DIRECCION_LOCAL}</span>
              </p>
            )}

            {tipoEntrega === 'envio' && (
              <div className="space-y-4 mt-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    name="calle"
                    placeholder="Calle"
                    value={direccionEnvio.calle}
                    onChange={handleChangeDireccion}
                    required
                    className="sm:col-span-2 w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                  />
                  <input
                    name="numero"
                    placeholder="Número"
                    value={direccionEnvio.numero}
                    onChange={handleChangeDireccion}
                    required
                    className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                  />
                </div>
                <input
                  name="piso"
                  placeholder="Piso / Depto (opcional)"
                  value={direccionEnvio.piso}
                  onChange={handleChangeDireccion}
                  className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="ciudad"
                    placeholder="Ciudad"
                    value={direccionEnvio.ciudad}
                    onChange={handleChangeDireccion}
                    required
                    className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                  />
                  <input
                    name="provincia"
                    placeholder="Provincia"
                    value={direccionEnvio.provincia}
                    onChange={handleChangeDireccion}
                    required
                    className="w-full bg-oscuro border border-borde rounded px-4 py-3 text-crema focus:border-dorado outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="bg-carta border border-borde rounded-lg p-6">
            <h2 className="text-crema font-bold mb-4">Método de pago</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                  metodoPago === 'efectivo' ? 'border-dorado' : 'border-borde hover:border-gris'
                }`}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === 'efectivo'}
                  onChange={() => setMetodoPago('efectivo')}
                  className="accent-dorado"
                />
                <span className={metodoPago === 'efectivo' ? 'text-dorado' : 'text-crema'}>
                  Efectivo al retirar/recibir
                </span>
              </label>

              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                  metodoPago === 'transferencia' ? 'border-dorado' : 'border-borde hover:border-gris'
                }`}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === 'transferencia'}
                  onChange={() => setMetodoPago('transferencia')}
                  className="accent-dorado"
                />
                <span className={metodoPago === 'transferencia' ? 'text-dorado' : 'text-crema'}>
                  Transferencia bancaria
                </span>
              </label>

              {metodoPago === 'transferencia' && (
                <p className="text-gris text-sm">
                  Te enviaremos los datos bancarios por email luego de confirmar el pedido.
                </p>
              )}

              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                  metodoPago === 'mercadopago' ? 'border-dorado' : 'border-borde hover:border-gris'
                }`}
              >
                <input
                  type="radio"
                  name="metodoPago"
                  checked={metodoPago === 'mercadopago'}
                  onChange={() => setMetodoPago('mercadopago')}
                  className="accent-dorado"
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                <span className={metodoPago === 'mercadopago' ? 'text-dorado' : 'text-crema'}>
                  Tarjeta / Mercado Pago
                </span>
              </label>

              {metodoPago === 'mercadopago' && (
                <p className="text-gris text-sm">
                  Vas a ser redirigido a Mercado Pago para completar el pago de forma segura.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="bg-carta border border-borde rounded-lg p-6 h-fit">
          <h2 className="text-crema font-bold mb-4">Resumen del pedido</h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={`${item._id}-${item.talla}`} className="flex items-center gap-3">
                <img
                  src={item.imagen || 'https://via.placeholder.com/100x133?text=URBX'}
                  alt={item.nombre}
                  className="w-12 h-16 object-cover rounded shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-crema text-sm truncate capitalize">{item.nombre}</p>
                  <p className="text-gris2 text-xs">
                    Talla: {item.talla} · x{item.cantidad}
                  </p>
                </div>
                <p className="text-dorado text-sm font-bold shrink-0">
                  {formatearPrecio(item.precio * item.cantidad)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm border-t border-borde pt-4">
            <div className="flex justify-between text-crema opacity-80">
              <span>Subtotal</span>
              <span>{formatearPrecio(total)}</span>
            </div>
            <div className="flex justify-between text-crema opacity-80">
              <span>Envío</span>
              <span>{tipoEntrega === 'retiro' ? 'Gratis' : 'A coordinar'}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-borde">
            <span className="text-crema font-medium">Total</span>
            <span className="text-dorado font-bold text-xl">{formatearPrecio(total)}</span>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full mt-6 bg-dorado text-oscuro font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {enviando ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </form>
  )
}
