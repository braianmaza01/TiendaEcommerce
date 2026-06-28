import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../AuthContext'

const campoClase =
  'w-full bg-oscuro border border-borde px-4 py-3 text-crema focus:border-dorado outline-none transition-colors'

const contenedorVariantes = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.5 },
  },
}

const itemVariantes = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const { login } = useAdminAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      await login(usuario, contrasena)
      navigate('/admin')
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-oscuro flex items-center justify-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(200,169,110,0.10), transparent 60%)',
        }}
      />
      <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-dorado/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-dorado/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-2xl font-bold tracking-[0.3em] text-crema mb-1">
            URBX
          </p>
          <p className="text-center text-[11px] tracking-[0.2em] text-gris2 mb-10">
            ADMIN PANEL
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ boxShadow: '0 0 40px rgba(200, 169, 110, 0.15)' }}
          className="bg-carta border border-borde p-8 space-y-5"
        >
          <motion.div
            variants={contenedorVariantes}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <motion.div variants={itemVariantes}>
              <label className="block text-xs tracking-[0.15em] text-gris mb-2">
                USUARIO
              </label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
                className={campoClase}
              />
            </motion.div>

            <motion.div variants={itemVariantes}>
              <label className="block text-xs tracking-[0.15em] text-gris mb-2">
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className={campoClase}
              />
            </motion.div>

            {error && (
              <motion.p variants={itemVariantes} className="text-red-400 text-sm">
                {error}
              </motion.p>
            )}

            <motion.button
              variants={itemVariantes}
              type="submit"
              disabled={cargando}
              className="relative w-full overflow-hidden group bg-dorado text-oscuro font-bold tracking-[0.15em] py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">
                {cargando ? 'INGRESANDO...' : 'INGRESAR'}
              </span>
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}
