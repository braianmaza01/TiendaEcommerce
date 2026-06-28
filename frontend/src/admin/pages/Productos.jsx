import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/cliente'
import { formatearPrecio } from '../../utils/formato'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargar()
  }, [])

  function cargar() {
    setCargando(true)
    api
      .get('/productos')
      .then((res) => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false))
  }

  async function handleEliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await api.delete(`/productos/${id}`)
      setProductos((prev) => prev.filter((p) => p._id !== id))
    } catch {
      alert('No se pudo eliminar el producto.')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-crema">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="bg-dorado text-oscuro font-bold text-sm tracking-wide px-5 py-3 text-center hover:opacity-90 transition-opacity"
        >
          + Nuevo producto
        </Link>
      </div>

      {cargando && <p className="text-gris">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!cargando && !error && (
        <>
          <div className="md:hidden space-y-3">
            {productos.map((p) => (
              <div key={p._id} className="bg-carta border border-borde p-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-crema font-medium">{p.nombre}</p>
                  <p className="text-dorado font-bold shrink-0">
                    {formatearPrecio(p.precio)}
                  </p>
                </div>
                <p className="text-gris2 text-xs capitalize mb-4">
                  {p.categoria} · Stock: {p.stock}
                </p>
                <div className="flex gap-3">
                  <Link
                    to={`/admin/productos/editar/${p._id}`}
                    className="flex-1 text-center border border-borde text-dorado py-3 text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEliminar(p._id)}
                    className="flex-1 text-center border border-borde text-red-400 py-3 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {productos.length === 0 && (
              <p className="text-center text-gris2 py-6">No hay productos.</p>
            )}
          </div>

          <div className="hidden md:block bg-carta border border-borde overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-borde text-gris2 text-xs tracking-[0.15em]">
                  <th className="px-4 py-3">NOMBRE</th>
                  <th className="px-4 py-3">CATEGORÍA</th>
                  <th className="px-4 py-3">PRECIO</th>
                  <th className="px-4 py-3">STOCK</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p._id} className="border-b border-borde text-crema">
                    <td className="px-4 py-3">{p.nombre}</td>
                    <td className="px-4 py-3 text-gris capitalize">
                      {p.categoria}
                    </td>
                    <td className="px-4 py-3 text-dorado">
                      {formatearPrecio(p.precio)}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-right space-x-4">
                      <Link
                        to={`/admin/productos/editar/${p._id}`}
                        className="text-dorado hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEliminar(p._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gris2">
                      No hay productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
