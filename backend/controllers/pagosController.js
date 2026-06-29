import { MercadoPagoConfig, Preference } from 'mercadopago'

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
