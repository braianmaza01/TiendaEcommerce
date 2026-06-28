import { Routes, Route, Outlet } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import ComoComprar from './pages/ComoComprar'
import RetiroEnLocal from './pages/RetiroEnLocal'
import Envios from './pages/Envios'
import Contacto from './pages/Contacto'
import SobreNosotros from './pages/SobreNosotros'
import { AdminAuthProvider } from './admin/AuthContext'
import RutaProtegida from './admin/RutaProtegida'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/pages/Login'
import Dashboard from './admin/pages/Dashboard'
import Productos from './admin/pages/Productos'
import ProductoForm from './admin/pages/ProductoForm'
import Pedidos from './admin/pages/Pedidos'

function TiendaLayout() {
  return (
    <div className="min-h-screen bg-oscuro flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<TiendaLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/como-comprar" element={<ComoComprar />} />
          <Route path="/retiro-en-local" element={<RetiroEnLocal />} />
          <Route path="/envios" element={<Envios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <Outlet />
            </AdminAuthProvider>
          }
        >
          <Route path="login" element={<Login />} />
          <Route
            element={
              <RutaProtegida>
                <AdminLayout />
              </RutaProtegida>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/nuevo" element={<ProductoForm />} />
            <Route path="productos/editar/:id" element={<ProductoForm />} />
            <Route path="pedidos" element={<Pedidos />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
