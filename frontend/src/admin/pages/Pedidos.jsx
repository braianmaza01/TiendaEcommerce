import { useEffect, useState } from 'react'
import api from '../../api/cliente'
import { formatearPrecio } from '../../utils/formato'

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']

const FILTROS = [
  { label: 'TODOS', valor: 'todos' },
  { label: 'PENDIENTES', valor: 'pendiente' },
  { label: 'PAGADOS', valor: 'pagado' },
  { label: 'ENVIADOS', valor: 'enviado' },
  { label: 'ENTREGADOS', valor: 'entregado' },
  { label: 'CANCELADOS', valor: 'cancelado' },
]

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    api
      .get('/pedidos')
      .then((res) => setPedidos(res.data))
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setCargando(false))
  }, [])

  async function handleEstadoChange(id, estado) {
    try {
      await api.put(`/pedidos/${id}`, { estado })
      setPedidos((prev) =>
        prev.map((p) => (p._id === id ? { ...p, estado } : p))
      )
    } catch {
      alert('No se pudo actualizar el estado.')
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm('¿Estás seguro que querés eliminar este pedido?')) return
    try {
      await api.delete(`/pedidos/${id}`)
      setPedidos((prev) => prev.filter((p) => p._id !== id))
    } catch {
      alert('No se pudo eliminar el pedido.')
    }
  }

  async function handleCancelarViejos() {
    if (
      !window.confirm(
        '¿Cancelar todos los pedidos pendientes de más de 7 días?'
      )
    )
      return

    try {
      const res = await api.put('/pedidos/cancelar-viejos')
      const actualizados = await api.get('/pedidos')
      setPedidos(actualizados.data)
      alert(`Se cancelaron ${res.data.cancelados} pedido(s).`)
    } catch {
      alert('No se pudieron cancelar los pedidos pendientes.')
    }
  }

  async function handleEliminarCancelados() {
    if (
      !window.confirm(
        '¿Eliminar todos los pedidos cancelados? Esta acción no se puede deshacer.'
      )
    )
      return

    try {
      const res = await api.delete('/pedidos/cancelar-todos')
      setPedidos((prev) => prev.filter((p) => p.estado !== 'cancelado'))
      alert(`Se eliminaron ${res.data.eliminados} pedido(s).`)
    } catch {
      alert('No se pudieron eliminar los pedidos cancelados.')
    }
  }

  const pedidosFiltrados = pedidos.filter(
    (p) => filtro === 'todos' || p.estado === filtro
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-crema mb-8">Pedidos</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-borde pb-5">
        <div className="flex flex-wrap gap-6">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`text-xs tracking-[0.15em] transition-colors ${
                filtro === f.valor ? 'text-dorado' : 'text-gris hover:text-crema'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {filtro === 'pendiente' && (
            <button
              type="button"
              onClick={handleCancelarViejos}
              className="border border-dorado text-dorado text-xs tracking-[0.1em] px-4 py-2 rounded hover:bg-dorado hover:text-oscuro transition-colors"
            >
              Cancelar pendientes viejos
            </button>
          )}
          {filtro === 'cancelado' && (
            <button
              type="button"
              onClick={handleEliminarCancelados}
              className="border border-[#e53935] text-[#e53935] text-xs tracking-[0.1em] px-4 py-2 rounded hover:bg-[#e53935] hover:text-crema transition-colors"
            >
              Eliminar cancelados
            </button>
          )}
        </div>
      </div>

      {cargando && <p className="text-gris">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!cargando && !error && (
        <div className="space-y-4">
          {pedidosFiltrados.length === 0 && (
            <p className="text-gris2">No hay pedidos en esta categoría.</p>
          )}

          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido._id}
              className="bg-carta border border-borde p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-crema font-medium">
                    {pedido.cliente?.nombre}
                  </p>
                  <p className="text-gris text-sm">{pedido.cliente?.email}</p>
                  <p className="text-gris text-sm">{pedido.cliente?.telefono}</p>
                  <p className="text-gris2 text-xs mt-1 capitalize">
                    {pedido.entrega?.tipo === 'envio'
                      ? `Envío: ${pedido.entrega?.calle} ${pedido.entrega?.numero}${
                          pedido.entrega?.piso ? `, ${pedido.entrega.piso}` : ''
                        }, ${pedido.entrega?.ciudad}, ${pedido.entrega?.provincia}`
                      : 'Retiro en local'}
                  </p>
                  <p className="text-gris2 text-xs capitalize">
                    Pago: {pedido.metodoPago}
                  </p>
                  <p className="text-gris2 text-xs mt-1">
                    {formatearFecha(pedido.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-dorado font-bold text-lg">
                    {formatearPrecio(pedido.total)}
                  </p>
                  <select
                    value={pedido.estado}
                    onChange={(e) =>
                      handleEstadoChange(pedido._id, e.target.value)
                    }
                    className="mt-2 bg-oscuro border border-borde text-crema text-sm px-3 py-2.5 capitalize"
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>

                  {pedido.estado === 'cancelado' && (
                    <button
                      type="button"
                      onClick={() => handleEliminar(pedido._id)}
                      className="block mt-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              <ul className="text-sm text-gris space-y-1 border-t border-borde pt-3">
                {pedido.productos?.map((item, idx) => (
                  <li key={idx}>
                    {item.cantidad}x {item.nombre}{' '}
                    {item.talla && `(${item.talla})`} — {formatearPrecio(item.precio)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
