import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, default: '' },
    precio: { type: Number, required: true },
    precioAnterior: { type: Number },
    imagen: { type: String, default: '' },
    categoria: {
      type: String,
      enum: ['remeras', 'buzos', 'pantalones', 'accesorios', 'camperas', 'general'],
      default: 'general',
    },
    genero: { type: String, enum: ['hombre', 'mujer', 'unisex'], default: 'unisex' },
    enPromocion: { type: Boolean, default: false },
    tallas: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Producto', productoSchema)
