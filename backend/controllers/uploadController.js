export function subirImagen(req, res) {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se recibió ningún archivo' })
  }

  res.json({ url: req.file.path })
}
