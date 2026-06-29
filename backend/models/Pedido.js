import mongoose from 'mongoose'

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      nombre: { type: String, required: true },
      email: { type: String, required: true },
      telefono: { type: String, required: true },
    },
    entrega: {
      tipo: { type: String, enum: ['retiro', 'envio'], required: true },
      calle: { type: String, default: '' },
      numero: { type: String, default: '' },
      piso: { type: String, default: '' },
      ciudad: { type: String, default: '' },
      provincia: { type: String, default: '' },
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'transferencia', 'mercadopago'],
      default: 'efectivo',
    },
    productos: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
        nombre: { type: String, required: true },
        talla: { type: String, default: '' },
        cantidad: { type: Number, required: true, default: 1 },
        precio: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Pedido', pedidoSchema)
