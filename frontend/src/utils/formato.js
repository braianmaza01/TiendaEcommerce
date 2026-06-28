export function formatearPrecio(precio) {
  return `$${Number(precio).toLocaleString('es-AR')}`
}
