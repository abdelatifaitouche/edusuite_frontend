function formatPrice(p) {
  if (!p) return "—"
  return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(p)
}


export default formatPrice;