import { useEffect, useState } from 'react'
import api from '../../api/cliente'
import { formatearPrecio } from '../../utils/formato'

const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

function esDelMes(fecha) {
  return new Date(fecha) >= inicioMes
}

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/pedidos')])
      .then(([prodRes, pedRes]) => {
        setProductos(prodRes.data)
        setPedidos(pedRes.data)
      })
      .catch(() => setError('No se pudieron cargar los datos.'))
      .finally(() => setCargando(false))
  }, [])

  const pedidosDelMes = pedidos.filter((p) => esDelMes(p.createdAt))

  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const entregadosMes = pedidosDelMes.filter((p) => p.estado === 'entregado').length
  const cancelados = pedidos.filter((p) => p.estado === 'cancelado').length

  const ingresosMes = pedidosDelMes
    .filter((p) => p.estado === 'pagado' || p.estado === 'entregado')
    .reduce((acc, p) => acc + p.total, 0)

  const conteoProductos = {}
  pedidosDelMes
    .filter((p) => p.estado !== 'cancelado')
    .forEach((pedido) => {
      pedido.productos?.forEach((item) => {
        conteoProductos[item.nombre] =
          (conteoProductos[item.nombre] || 0) + item.cantidad
      })
    })

  let productoTop = null
  let cantidadTop = 0
  Object.entries(conteoProductos).forEach(([nombre, cantidad]) => {
    if (cantidad > cantidadTop) {
      productoTop = nombre
      cantidadTop = cantidad
    }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-crema mb-8">Dashboard</h1>

      {cargando && <p className="text-gris">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!cargando && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="bg-carta border border-borde p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                TOTAL PRODUCTOS
              </p>
              <p className="text-3xl font-bold text-crema">{productos.length}</p>
            </div>
            <div className="bg-carta border border-borde p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                TOTAL PEDIDOS
              </p>
              <p className="text-3xl font-bold text-crema">{pedidos.length}</p>
            </div>
            <div className="bg-carta border border-borde p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                PEDIDOS PENDIENTES
              </p>
              <p className="text-3xl font-bold text-dorado">{pendientes}</p>
            </div>
            <div className="bg-carta border border-borde p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                ENTREGADOS ESTE MES
              </p>
              <p className="text-3xl font-bold text-green-400">{entregadosMes}</p>
            </div>
            <div className="bg-carta border border-borde p-6">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-2">
                PEDIDOS CANCELADOS
              </p>
              <p className="text-3xl font-bold text-red-400">{cancelados}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-carta border border-borde p-8">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-3">
                INGRESOS DEL MES
              </p>
              <p className="text-4xl font-bold text-dorado">
                {formatearPrecio(ingresosMes)}
              </p>
              <p className="text-gris2 text-xs mt-2">
                Pedidos pagados o entregados este mes
              </p>
            </div>

            <div className="bg-carta border border-borde p-8">
              <p className="text-xs tracking-[0.2em] text-gris2 mb-3">
                PRODUCTO MÁS VENDIDO DEL MES
              </p>
              {productoTop ? (
                <>
                  <p className="text-2xl font-bold text-crema capitalize">
                    {productoTop}
                  </p>
                  <p className="text-gris2 text-xs mt-2">
                    {cantidadTop} unidades vendidas
                  </p>
                </>
              ) : (
                <p className="text-gris text-sm">Todavía no hay ventas este mes.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
