import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/cliente'

const CATEGORIAS = ['remeras', 'buzos', 'pantalones', 'accesorios', 'camperas']
const GENEROS = ['hombre', 'mujer', 'unisex']
const GRUPOS_TALLES = [
  { titulo: 'Letras', talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { titulo: 'Ropa', talles: ['1', '2', '3', '4', '5', '6'] },
  { titulo: 'Pantalón', talles: ['36', '38', '40', '42', '44', '46'] },
]

const vacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'remeras',
  genero: 'unisex',
  enPromocion: false,
  precioAnterior: '',
  tallas: [],
  stock: '',
  imagen: '',
}

const campoClase =
  'w-full bg-oscuro border border-borde px-4 py-3 text-crema focus:border-dorado outline-none transition-colors'
const labelClase = 'block text-xs tracking-[0.15em] text-gris mb-2'

export default function ProductoForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(vacio)
  const [cargando, setCargando] = useState(editando)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState('')
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  useEffect(() => {
    if (!editando) return
    api
      .get(`/productos/${id}`)
      .then((res) => {
        const p = res.data
        setForm({
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          precio: p.precio ?? '',
          categoria: p.categoria || 'remeras',
          genero: p.genero || 'unisex',
          enPromocion: Boolean(p.enPromocion),
          precioAnterior: p.precioAnterior ?? '',
          tallas: p.tallas || [],
          stock: p.stock ?? '',
          imagen: p.imagen || '',
        })
        setPreview(p.imagen || '')
      })
      .catch(() => setError('No se pudo cargar el producto.'))
      .finally(() => setCargando(false))
  }, [id, editando])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleImagenChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setSubiendoImagen(true)
    setError(null)

    const data = new FormData()
    data.append('imagen', file)

    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm((prev) => ({ ...prev, imagen: res.data.url }))
      setPreview(res.data.url)
    } catch {
      setError('No se pudo subir la imagen.')
      setPreview(form.imagen || '')
    } finally {
      setSubiendoImagen(false)
    }
  }

  function handlePromocionToggle() {
    setForm((prev) => ({ ...prev, enPromocion: !prev.enPromocion }))
  }

  function handleTalleToggle(talle) {
    setForm((prev) => ({
      ...prev,
      tallas: prev.tallas.includes(talle)
        ? prev.tallas.filter((t) => t !== talle)
        : [...prev.tallas, talle],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      precioAnterior:
        form.enPromocion && form.precioAnterior !== ''
          ? Number(form.precioAnterior)
          : undefined,
    }

    try {
      if (editando) {
        await api.put(`/productos/${id}`, payload)
      } else {
        await api.post('/productos', payload)
      }
      navigate('/admin/productos')
    } catch {
      setError('No se pudo guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p className="text-gris">Cargando...</p>

  return (
    <div className="max-w-2xl pb-28 md:pb-0">
      <h1 className="text-2xl font-bold text-crema mb-8">
        {editando ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-carta border border-borde p-4 sm:p-6 space-y-5"
      >
        <div>
          <label className={labelClase}>NOMBRE</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className={campoClase}
          />
        </div>

        <div>
          <label className={labelClase}>DESCRIPCIÓN</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className={campoClase}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClase}>PRECIO</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
              min="0"
              className={campoClase}
            />
          </div>
          <div>
            <label className={labelClase}>STOCK</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className={campoClase}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClase}>CATEGORÍA</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={campoClase}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClase}>GÉNERO</label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className={campoClase}
            >
              {GENEROS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.enPromocion}
            onChange={handlePromocionToggle}
            className="hidden"
          />
          <span
            className={`w-5 h-5 border flex items-center justify-center text-xs ${
              form.enPromocion ? 'border-dorado text-dorado' : 'border-borde text-gris'
            }`}
          >
            {form.enPromocion ? '✓' : ''}
          </span>
          <span className="text-sm text-crema">En promoción</span>
        </label>

        {form.enPromocion && (
          <div>
            <label className={labelClase}>PRECIO ANTERIOR</label>
            <input
              type="number"
              name="precioAnterior"
              value={form.precioAnterior}
              onChange={handleChange}
              min="0"
              placeholder="Precio original antes del descuento"
              className={campoClase}
            />
          </div>
        )}

        <div>
          <label className={labelClase}>TALLES DISPONIBLES</label>
          <div className="space-y-4">
            {GRUPOS_TALLES.map((grupo) => (
              <div key={grupo.titulo}>
                <p className="text-sm text-crema mb-2">{grupo.titulo}</p>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                  {grupo.talles.map((talle) => (
                    <label
                      key={talle}
                      className={`px-4 py-2 border cursor-pointer text-sm text-center transition-colors ${
                        form.tallas.includes(talle)
                          ? 'border-dorado text-dorado'
                          : 'border-borde text-gris'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.tallas.includes(talle)}
                        onChange={() => handleTalleToggle(talle)}
                        className="hidden"
                      />
                      {talle}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClase}>IMAGEN</label>

          {preview && (
            <div className="mb-3 w-32 h-32 sm:w-40 sm:h-40 bg-oscuro border border-borde overflow-hidden">
              <img
                src={preview}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={subiendoImagen}
            className="block w-full text-sm text-gris file:mr-4 file:py-2.5 file:px-4 file:border file:border-borde file:bg-oscuro file:text-crema file:text-sm file:cursor-pointer hover:file:border-dorado cursor-pointer disabled:opacity-50"
          />

          {subiendoImagen && (
            <p className="text-dorado text-sm mt-2">Subiendo imagen...</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2 fixed bottom-0 left-0 right-0 bg-oscuro border-t border-borde p-4 z-10 md:static md:bg-transparent md:border-0 md:p-0">
          <button
            type="submit"
            disabled={guardando || subiendoImagen}
            className="flex-1 md:flex-none bg-dorado text-oscuro font-bold tracking-wide px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="flex-1 md:flex-none border border-borde text-gris px-6 py-3 hover:text-crema transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
