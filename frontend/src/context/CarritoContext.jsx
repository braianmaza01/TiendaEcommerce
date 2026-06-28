import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContext = createContext()

export function useCarrito() {
  return useContext(CarritoContext)
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('urbx_carrito')
    return guardado ? JSON.parse(guardado) : []
  })

  useEffect(() => {
    localStorage.setItem('urbx_carrito', JSON.stringify(items))
  }, [items])

  function agregarItem(producto, talla, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find(
        (item) => item._id === producto._id && item.talla === talla
      )
      if (existente) {
        return prev.map((item) =>
          item._id === producto._id && item.talla === talla
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }
      return [...prev, { ...producto, talla, cantidad }]
    })
  }

  function quitarItem(_id, talla) {
    setItems((prev) =>
      prev.filter((item) => !(item._id === _id && item.talla === talla))
    )
  }

  function actualizarCantidad(_id, talla, cantidad) {
    setItems((prev) =>
      prev.map((item) =>
        item._id === _id && item.talla === talla ? { ...item, cantidad } : item
      )
    )
  }

  function vaciarCarrito() {
    setItems([])
  }

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)

  const value = {
    items,
    agregarItem,
    quitarItem,
    actualizarCantidad,
    vaciarCarrito,
    total,
    cantidadTotal,
  }

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  )
}
