import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import Pedido from '../models/Pedido.js'

export async function crearPreferencia(req, res) {
  try {
    const { items, comprador, pedidoId } = req.body

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
    const preference = new Preference(client)

    const resultado = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: Number(item.precio),
          currency_id: 'ARS',
        })),
        payer: {
          name: comprador?.nombre,
          email: comprador?.email,
        },
        external_reference: pedidoId,
        back_urls: {
          success: 'https://urbx-store.netlify.app/pago-exitoso',
          failure: 'https://urbx-store.netlify.app/pago-fallido',
          pending: 'https://urbx-store.netlify.app/pago-pendiente',
        },
        auto_return: 'approved',
        notification_url: 'https://urbx-backend-9soz.onrender.com/api/pagos/webhook',
      },
    })

    res.json({ init_point: resultado.init_point })
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear la preferencia de pago',
      error: error.message,
    })
  }
}

export async function webhook(req, res) {
  try {
    const tipo = req.query.type || req.body?.type
    const paymentId = req.query['data.id'] || req.body?.data?.id

    if (tipo === 'payment' && paymentId) {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
      const paymentClient = new Payment(client)
      const pago = await paymentClient.get({ id: paymentId })

      const externalReference = pago.external_reference
      const estadoPago = pago.status

      if (externalReference) {
        if (estadoPago === 'approved') {
          await Pedido.findByIdAndUpdate(externalReference, { estado: 'pagado' })
        } else if (estadoPago === 'rejected') {
          await Pedido.findByIdAndUpdate(externalReference, { estado: 'cancelado' })
        }
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Error al procesar webhook de Mercado Pago:', error.message)
    res.sendStatus(200)
  }
}
