import jwt from 'jsonwebtoken'

export async function login(req, res) {
  const { usuario, contrasena } = req.body

  if (
    usuario !== process.env.ADMIN_USUARIO ||
    contrasena !== process.env.ADMIN_CONTRASENA
  ) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })
  }

  const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  })

  res.json({ token })
}
