import { useEffect, useState } from 'react'
import axios from 'axios'
import Hero from '../components/Hero'
import Destacados from '../components/Destacados'
import BannerRetiro from '../components/BannerRetiro'
import { API_URL } from '../utils/api'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    axios
      .get(`${API_URL}/api/productos`)
      .then((res) => setProductos(res.data))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div>
      <Hero productos={productos} />
      <Destacados productos={productos} cargando={cargando} />
      <BannerRetiro />
    </div>
  )
}
