import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { API_URL } from '@/config'
import './CartaPublicaPage.scss'

const API_BASE = `${API_URL}/api/v1/carta/activa`

const formatFecha = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

const formatPrice = (n) =>
  Number(n ?? 0).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  })

/* ── SVG Icons ──────────────────────────────────── */

const WineGlassIcon = memo(function WineGlassIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3 Q6 14 14 16 Q22 14 22 3" />
      <line x1="14" y1="16" x2="14" y2="23" />
      <line x1="9" y1="23" x2="19" y2="23" />
    </svg>
  )
})

const GrapeClusterIcon = memo(function GrapeClusterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="9" r="3" />
      <circle cx="8" cy="13" r="2.5" />
      <circle cx="16" cy="13" r="2.5" />
      <circle cx="12" cy="13" r="2.5" />
      <circle cx="9.5" cy="17" r="2" />
      <circle cx="14.5" cy="17" r="2" />
    </svg>
  )
})

const CloseIcon = memo(function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
})

const WarningIcon = memo(function WarningIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 L3 21 L21 21 Z" />
      <line x1="12" y1="10" x2="12" y2="15" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
})

/* ── Page ───────────────────────────────────────── */

const CartaPublicaPage = () => {
  const [carta, setCarta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchCarta = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_BASE, { signal })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'No pudimos obtener la carta del restaurante.')
      }
      setCarta(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCarta(controller.signal)
    return () => controller.abort()
  }, [fetchCarta])

  const handleRetry = useCallback(() => {
    fetchCarta()
  }, [fetchCarta])

  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const categorias = useMemo(() => {
    const list = carta?.categorias ?? []
    return [...list].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
  }, [carta])
  const hasCategorias = categorias.length > 0

  if (loading && !carta) {
    return <CartaSkeleton />
  }

  if (error) {
    return <CartaError mensaje={error} onRetry={handleRetry} />
  }

  if (!hasCategorias) {
    return <CartaVacia />
  }

  return (
    <div className="carta-publica">
      <FontsHead />
      <Hero nombre={carta.nombre} fechaDesde={carta.fechaDesde} fechaHasta={carta.fechaHasta} />
      <main className="carta-publica__main">
        {categorias.map((categoria) => (
          <CategoriaCard key={categoria.id} categoria={categoria} onSelect={handleSelectItem} />
        ))}
      </main>
      <footer className="carta-publica__footer">
        <WineGlassIcon className="carta-publica__wine-icon" />
        <p>Gracias por su visita</p>
      </footer>
      {selectedItem ? <CartaItemModal item={selectedItem} onClose={handleCloseModal} /> : null}
    </div>
  )
}

/* ── Fonts ──────────────────────────────────────── */

const FontsHead = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap"
    />
  </>
)

/* ── Hero ───────────────────────────────────────── */

const Hero = memo(function Hero({ nombre, fechaDesde, fechaHasta }) {
  return (
    <header className="carta-publica__hero">
      <WineGlassIcon className="carta-publica__wine-icon" />
      <p className="carta-publica__kicker">Nuestra Carta</p>
      <h1 className="carta-publica__title">Aromas de Viña</h1>
      {nombre ? <p className="carta-publica__subtitle">{nombre}</p> : null}
      <div className="carta-publica__divider" aria-hidden="true">
        <span className="carta-publica__divider-line" />
        <GrapeClusterIcon className="carta-publica__divider-icon" />
        <span className="carta-publica__divider-line" />
      </div>
      <p className="carta-publica__dates">
        Vigente del <em>{formatFecha(fechaDesde)}</em> al <em>{formatFecha(fechaHasta)}</em>
      </p>
    </header>
  )
})

/* ── Category ───────────────────────────────────── */

const CategoriaCard = memo(function CategoriaCard({ categoria, onSelect }) {
  const productos = categoria.productos ?? []
  const menus = categoria.menus ?? []
  const hasProductos = productos.length > 0
  const hasMenus = menus.length > 0
  const hasContent = hasProductos || hasMenus

  if (!hasContent) return null

  return (
    <section className="carta-categoria" aria-labelledby={`cat-${categoria.id}`}>
      <header className="carta-categoria__header">
        <h2 id={`cat-${categoria.id}`} className="carta-categoria__title">
          {categoria.nombre}
        </h2>
        <div className="carta-categoria__rule" aria-hidden="true">
          <span className="carta-categoria__rule-line" />
          <GrapeClusterIcon className="carta-categoria__rule-icon" />
          <span className="carta-categoria__rule-line" />
        </div>
      </header>

      {hasProductos ? (
        <ul className="carta-items">
          {productos.map((producto) => (
            <CartaItemCard key={producto.id} item={producto} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}

      {hasMenus ? (
        <ul className={`carta-items${hasProductos ? ' carta-items--separated' : ''}`}>
          {menus.map((menu) => (
            <CartaItemCard key={menu.id} item={menu} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </section>
  )
})

/* ── Item Card ──────────────────────────────────── */

const CartaItemCard = memo(function CartaItemCard({ item, onSelect }) {
  const imgUrl = item.imagenId ? `${API_URL}/api/v1/imagen/${item.imagenId}` : null

  const handleClick = () => onSelect(item)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(item)
    }
  }

  return (
    <li
      className="carta-item-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="carta-item-card__image-col">
        {imgUrl ? (
          <img className="carta-item-card__image" src={imgUrl} alt={item.nombre} loading="lazy" />
        ) : (
          <div
            className="carta-item-card__image carta-item-card__image--placeholder"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="carta-item-card__body">
        <h3 className="carta-item-card__name">{item.nombre}</h3>
        {item.descripcion ? <p className="carta-item-card__desc">{item.descripcion}</p> : null}
        <span className="carta-item-card__price">{formatPrice(item.precio)}</span>
      </div>
    </li>
  )
})

/* ── Item Modal ──────────────────────────────────── */

const CartaItemModal = memo(function CartaItemModal({ item, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const imgUrl = item.imagenId ? `${API_URL}/api/v1/imagen/${item.imagenId}` : null

  return (
    <div className="carta-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="carta-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.nombre}
      >
        <button type="button" className="carta-modal__close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </button>

        {imgUrl ? (
          <img className="carta-modal__image" src={imgUrl} alt={item.nombre} />
        ) : (
          <div className="carta-modal__image carta-modal__image--placeholder" aria-hidden="true">
            <WineGlassIcon />
          </div>
        )}

        <div className="carta-modal__body">
          <h2 className="carta-modal__name">{item.nombre}</h2>
          {item.descripcion ? <p className="carta-modal__desc">{item.descripcion}</p> : null}
          <div className="carta-modal__divider" aria-hidden="true" />
          <span className="carta-modal__price">{formatPrice(item.precio)}</span>
        </div>
      </div>
    </div>
  )
})

/* ── Skeleton ───────────────────────────────────── */

const SKELETON_CATS = [1, 2, 3]

const CartaSkeleton = () => (
  <div className="carta-publica" aria-busy="true" aria-live="polite">
    <FontsHead />
    <header className="carta-publica__hero">
      <div className="skeleton skeleton--ornament" />
      <div className="skeleton skeleton--kicker" />
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--subtitle" />
      <div className="skeleton skeleton--dates" />
    </header>
    <main className="carta-publica__main">
      {SKELETON_CATS.map((i) => (
        <div key={i} className="skeleton-categoria">
          <div className="skeleton skeleton--cat-title" />
          <div className="skeleton skeleton--item-name" />
          <div className="skeleton skeleton--item-line" />
          <div className="skeleton skeleton--item-line" />
        </div>
      ))}
    </main>
  </div>
)

/* ── Error / Empty ──────────────────────────────── */

const CartaError = memo(function CartaError({ mensaje, onRetry }) {
  return (
    <div className="carta-publica">
      <FontsHead />
      <div className="carta-publica__state">
        <div className="carta-publica__state-icon" aria-hidden="true">
          <WarningIcon />
        </div>
        <h2>No pudimos cargar la carta</h2>
        <p>{mensaje}</p>
        <button type="button" className="carta-publica__btn" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    </div>
  )
})

const CartaVacia = () => (
  <div className="carta-publica">
    <FontsHead />
    <div className="carta-publica__state">
      <div className="carta-publica__state-icon" aria-hidden="true">
        <WineGlassIcon />
      </div>
      <h2>No hay carta activa</h2>
      <p>En este momento el restaurante no tiene una carta vigente para mostrar.</p>
    </div>
  </div>
)

export default CartaPublicaPage
