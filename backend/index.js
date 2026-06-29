import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import productosRoutes from './routes/productos.js'
import pedidosRoutes from './routes/pedidos.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import pagosRoutes from './routes/pagos.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/pagos', pagosRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de URBX funcionando correctamente' })
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message)
  })
