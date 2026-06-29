import { useEffect, useState } from 'react'
import api from '../../api/cliente'
import { formatearPrecio } from '../../utils/formato'

function inicioDeMes(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1)
}

function esMismoMes(fechaA, fechaB) {
  return (
    fechaA.getFullYear() === fechaB.getFullYear() &&
    fechaA.getMonth() === fechaB.getMonth()
  )
}

function nombreMes(fecha) {
  const texto = fecha.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [mesSeleccionado, setMesSeleccionado] = useState(() => inicioDeMes(new Date()))

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/pedidos')])
      .then(([prodRes, pedRes]) => {
        setProductos(prodRes.data)
        setPedidos(pedRes.data)
      })
      .catch(() => setError('No se pudieron cargar los datos.'))
      .finally(() => setCargando(false))
  }, [])

  function cambiarMes(delta) {
    setMesSeleccionado(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    )
  }

  const esMesActual = esMismoMes(mesSeleccionado, inicioDeMes(new Date()))
  const mesAnteriorRef = new Date(
    mesSeleccionado.getFullYear(),
    mesSeleccionado.getMonth() - 1,
    1
  )

  const pedidosDelMes = pedidos.filter((p) =>
    esMismoMes(new Date(p.createdAt), mesSeleccionado)
  )
  const pedidosMesAnterior = pedidos.filter((p) =>
    esMismoMes(new Date(p.createdAt), mesAnteriorRef)
  )

  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const entregadosMes = pedidosDelMes.filter((p) => p.estado === 'entregado').length
  const canceladosMes = pedidosDelMes.filter((p) => p.estado === 'cancelado').length

  function calcularIngresos(lista) {
    return lista
      .filter((p) => p.estado === 'pagado' || p.estado === 'entregado')
      .reduce((acc, p) => acc + p.total, 0)
  }

  const ingresosMes = calcularIngresos(pedidosDelMes)
  const ingresosMesAnterior = calcularIngresos(pedidosMesAnterior)

  const crecimiento =
    ingresosMesAnterior === 0
      ? ingresosMes > 0
        ? 100
        : 0
      : ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100

  const maxIngresos = Math.max(ingresosMes, ingresosMesAnterior, 1)
  const anchoBarraActual = (ingresosMes / maxIngresos) * 100
  const anchoBarraAnterior = (ingresosMesAnterior / maxIngresos) * 100

  const conteoProductos = {}
  pedidosDelMes
    .filter((p) => p.estado !== 'cancelado')
    .forEach((pedido) => {
      pedido.productos?.forEach((item) => {
        if (!conteoProductos[item.nombre]) {
          conteoProductos[item.nombre] = { cantidad: 0, productoId: item.producto }
        }
        conteoProductos[item.nombre].cantidad += item.cantidad
      })
    })

  let productoTop = null
  let cantidadTop = 0
  let productoTopId = null
  Object.entries(conteoProductos).forEach(([nombre, info]) => {
    if (info.cantidad > cantidadTop) {
      productoTop = nombre
      cantidadTop = info.cantidad
      productoTopId = info.productoId
    }
  })

  const productoTopInfo = productos.find((p) => p._id === productoTopId)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-crema">Dashboard</h1>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => cambiarMes(-1)}
            aria-label="Mes anterior"
            className="w-9 h-9 flex items-center justify-center border border-borde rounded-lg text-crema hover:border-dorado hover:text-dorado transition-colors"
          >
            ←
          </button>
          <p className="text-crema font-medium capitalize w-44 text-center">
            {nombreMes(mesSeleccionado)}
          </p>
          <button
            type="button"
            onClick={() => cambiarMes(1)}
            disabled={esMesActual}
            aria-label="Mes siguiente"
            className="w-9 h-9 flex items-center justify-center border border-borde rounded-lg text-crema hover:border-dorado hover:text-dorado transition-colors disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-crema disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>

      {cargando && <p className="text-gris">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!cargando && !error && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg p-8 bg-dorado text-oscuro">
            <p className="text-xs tracking-[0.2em] mb-2 opacity-70">
              INGRESOS DE {nombreMes(mesSeleccionado).toUpperCase()}
            </p>
            <p className="text-4xl font-bold">{formatearPrecio(ingresosMes)}</p>
            <p className="text-xs mt-2 opacity-70">
              Pedidos pagados o entregados de este mes
            </p>
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 15.5c0 1 .9 1.5 2.5 1.5s2.5-.6 2.5-1.6c0-2-5-1-5-3 0-1 1-1.6 2.5-1.6s2.3.5 2.4 1.4" />
              <path d="M12 7v1.3M12 15.7V17" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                TOTAL PRODUCTOS
              </p>
              <p className="text-3xl font-bold text-crema">{productos.length}</p>
            </div>
            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                PEDIDOS PENDIENTES
              </p>
              <p className="text-3xl font-bold text-dorado">{pendientes}</p>
            </div>
            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                ENTREGADOS DEL MES
              </p>
              <p className="text-3xl font-bold text-[#4caf50]">{entregadosMes}</p>
            </div>
            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                CANCELADOS DEL MES
              </p>
              <p className="text-3xl font-bold text-[#e53935]">{canceladosMes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-4">
                PRODUCTO MÁS VENDIDO
              </p>
              {productoTop ? (
                <div className="flex items-center gap-4">
                  <img
                    src={
                      productoTopInfo?.imagen ||
                      'https://via.placeholder.com/80x100?text=URBX'
                    }
                    alt={productoTop}
                    className="w-16 h-20 object-cover rounded bg-oscuro shrink-0"
                  />
                  <div>
                    <p className="text-crema font-bold capitalize">{productoTop}</p>
                    <p className="text-gris2 text-sm mt-1">
                      {cantidadTop} unidades vendidas
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gris text-sm">Todavía no hay ventas este mes.</p>
              )}
            </div>

            <div className="bg-carta border border-borde rounded-lg p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-4">
                INGRESOS: MES ANTERIOR VS ACTUAL
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gris mb-1">
                    <span className="capitalize">{nombreMes(mesAnteriorRef)}</span>
                    <span>{formatearPrecio(ingresosMesAnterior)}</span>
                  </div>
                  <div className="h-2 bg-oscuro rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gris2"
                      style={{ width: `${anchoBarraAnterior}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-crema mb-1">
                    <span className="capitalize">{nombreMes(mesSeleccionado)}</span>
                    <span className="text-dorado font-bold">
                      {formatearPrecio(ingresosMes)}
                    </span>
                  </div>
                  <div className="h-2 bg-oscuro rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dorado"
                      style={{ width: `${anchoBarraActual}%` }}
                    />
                  </div>
                </div>
              </div>

              <p
                className={`mt-4 text-sm font-bold ${
                  crecimiento >= 0 ? 'text-[#4caf50]' : 'text-[#e53935]'
                }`}
              >
                {crecimiento >= 0 ? '▲' : '▼'} {Math.abs(crecimiento).toFixed(1)}%{' '}
                {crecimiento >= 0 ? 'más' : 'menos'} que el mes anterior
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
