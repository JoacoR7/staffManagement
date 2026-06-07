import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import './CartaPublicaPage.scss'

const API_BASE = 'http://localhost:9000/api/v1/carta/activa'

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
          <CategoriaCard key={categoria.id} categoria={categoria} onSelect={setSelectedItem} />
        ))}
      </main>
      <footer className="carta-publica__footer">
        <span className="carta-publica__ornament" aria-hidden="true">
          ❦
        </span>
        <p>Gracias por su visita</p>
      </footer>
      <ItemDetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}

const FontsHead = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,700&family=Lato:wght@300;400&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,700&family=Lato:wght@300;400&display=swap"
    />
  </>
)

const Hero = memo(function Hero({ nombre, fechaDesde, fechaHasta }) {
  return (
    <header className="carta-publica__hero">
      <span className="carta-publica__ornament" aria-hidden="true">
        ❦
      </span>
      <p className="carta-publica__kicker">Nuestra Carta</p>
      <h1 className="carta-publica__title">{nombre}</h1>
      <div className="carta-publica__divider" aria-hidden="true">
        <span className="carta-publica__divider-glyph">◆</span>
      </div>
      <p className="carta-publica__dates">
        Vigente del <em>{formatFecha(fechaDesde)}</em> al <em>{formatFecha(fechaHasta)}</em>
      </p>
    </header>
  )
})

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
          <span className="carta-categoria__rule-glyph">· · ·</span>
        </div>
      </header>

      {hasProductos ? (
        <ul className="carta-items">
          {productos.map((producto) => (
            <CartaItem
              key={producto.id}
              item={{
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
              }}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}

      {hasMenus ? (
        <ul className={`carta-items${hasProductos ? ' carta-items--separated' : ''}`}>
          {menus.map((menu) => (
            <CartaItem
              key={menu.id}
              item={{
                id: menu.id,
                nombre: menu.nombre,
                descripcion: menu.descripcion,
                precio: menu.precio,
              }}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </section>
  )
})

const CartaItem = memo(function CartaItem({ item, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(item)
  }, [item, onSelect])

  return (
    <li className="carta-item">
      <button type="button" className="carta-item__btn" onClick={handleClick}>
        <div className="carta-item__info">
          <h3 className="carta-item__name">{item.nombre}</h3>
          {item.descripcion ? <p className="carta-item__desc">{item.descripcion}</p> : null}
        </div>
        <span className="carta-item__price">{formatPrice(item.precio)}</span>
      </button>
    </li>
  )
})

const ItemDetailModal = memo(function ItemDetailModal({ item, onClose }) {
  return (
    <CModal visible={!!item} onClose={onClose} alignment="center" className="carta-modal">
      {item ? (
        <>
          <CModalHeader onClose={onClose}>
            <CModalTitle>{item.nombre}</CModalTitle>
          </CModalHeader>
          <CModalBody className="carta-modal__body">
            <div className="carta-modal__image-placeholder" aria-hidden="true">
              <span>Imagen</span>
            </div>
            {item.descripcion ? <p className="carta-modal__desc">{item.descripcion}</p> : null}
            <p className="carta-modal__price">{formatPrice(item.precio)}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="outline" onClick={onClose}>
              Cerrar
            </CButton>
          </CModalFooter>
        </>
      ) : null}
    </CModal>
  )
})

const SKELETON_CATS = [1, 2, 3]

const CartaSkeleton = () => (
  <div className="carta-publica" aria-busy="true" aria-live="polite">
    <FontsHead />
    <header className="carta-publica__hero">
      <div className="skeleton skeleton--ornament" />
      <div className="skeleton skeleton--kicker" />
      <div className="skeleton skeleton--title" />
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

const CartaError = memo(function CartaError({ mensaje, onRetry }) {
  return (
    <div className="carta-publica">
      <FontsHead />
      <div className="carta-publica__state">
        <div className="carta-publica__state-icon" aria-hidden="true">
          ⚠
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
        🍽
      </div>
      <h2>No hay carta activa</h2>
      <p>En este momento el restaurante no tiene una carta vigente para mostrar.</p>
    </div>
  </div>
)

export default CartaPublicaPage
