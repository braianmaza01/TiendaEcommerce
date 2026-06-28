import { useEffect, useState } from 'react'
import axios from 'axios'
import Hero from '../components/Hero'
import Destacados from '../components/Destacados'
import BannerRetiro from '../components/BannerRetiro'

export default function Home() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/productos')
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
