/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


// Paises
const PaisPage = React.lazy(() => import('./views/pages/paises/PaisPage'))
const ProvinciaPage = React.lazy(() => import('./views/pages/provincias/ProvinciaPage'))
const DepartamentoPage = React.lazy(() => import('./views/pages/departamentos/DepartamentoPage'))
const LocalidadPage = React.lazy(() => import('./views/pages/localidades/LocalidadPage'))
const DireccionPage = React.lazy(() => import('./views/pages/direccion/DireccionPage'))

// Sección artículos
//Artículos
const ArticulosPage = React.lazy(() => import('./views/pages/articulos/ArticulosPage'))

const ReciboPage = React.lazy(() => import('./views/pages/reciboDeSueldo/ReciboPage'))
const ComandaPage = React.lazy(() => import('./views/pages/comanda/ComandaPage'))

// Unidades de medida
const UnidadesDeMedidaPage = React.lazy(
  () => import('./views/pages/unidadesMedida/UnidadesDeMedidaPage'),
)

// Promocion
const PromocionPage = React.lazy(() => import('./views/pages/promocion/PromocionPage'))

// Stock
const StockPage = React.lazy(() => import('./views/pages/stock/StockPage'))

// Movimiento stock
const MovimientoStockPage = React.lazy(
  () => import('./views/pages/movimientoStock/MovimientoStockPage'),
)

// Sección empleados
const EmpleadoPage = React.lazy(() => import('./views/pages/empleado/EmpleadoPage'))
const RegistroHorarioPage = React.lazy(
  () => import('./views/pages/registroHorario/RegistroHorario'),
)

// Categoria
const CategoriaPage = React.lazy(() => import('./views/pages/categorias/CategoriaPage'))
const CartaPage = React.lazy(() => import('./views/pages/cartas/CartaPage'))
const MenuPage = React.lazy(() => import('./views/pages/menus/MenuPage'))

// Cliente
const ClientePage = React.lazy(() => import('./views/pages/cliente/ClientePage'))
//Empresa
const EmpresaPage = React.lazy(() => import('./views/pages/empresa/EmpresaPage'))

const ItemPage = React.lazy(() => import('./views/pages/items/ItemPage'))

const ReseniasPage = React.lazy(() => import('./views/pages/resenias/ReseniasPage'))
const HistorialVisitasRestaurantPage = React.lazy(
  () => import('./views/pages/historialVisitasRestaurant/HistorialVisitasRestaurantPage'),
)

/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 *
 * @example
 * // Route with exact match required
 * { path: '/base', name: 'Base', element: Cards, exact: true }
 */
export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/resenias/listar', name: 'Reseñas', element: ReseniasPage },
  { path: '/paises/listar', name: 'Paises', element: PaisPage },
  { path: '/provincias/listar', name: 'Provincias', element: ProvinciaPage },
  { path: '/departamentos/listar', name: 'Departamento', element: DepartamentoPage },
  { path: '/localidades/listar', name: 'Localidad', element: LocalidadPage },
  { path: '/promociones/listar', name: 'Promocion', element: PromocionPage },
  { path: '/unidades-medida/listar', name: 'Unidades de Medida', element: UnidadesDeMedidaPage },
  { path: '/articulos/listar', name: 'Artículos', element: ArticulosPage },
  { path: '/empleados/listar', name: 'Empleados', element: EmpleadoPage },
  { path: '/registroHorario/listar', name: 'Registro Horario', element: RegistroHorarioPage },
  { path: '/recibos-de-sueldo/listar', name: 'Recibos de Sueldo', element: ReciboPage },
  { path: '/comandas/listar', name: 'Comandas', element: ComandaPage },
  { path: '/stock/listar', name: 'Stock', element: StockPage },
  { path: '/movimientos-stock/listar', name: 'Movimiento Stock', element: MovimientoStockPage },
  { path: '/categorias/listar', name: 'Categoria', element: CategoriaPage },
  { path: '/cartas/listar', name: 'Carta', element: CartaPage },
  { path: '/menus/listar', name: 'Menú', element: MenuPage },
  { path: '/direccion/listar', name: 'Direcciones', element: DireccionPage },
  { path: '/cliente/listar', name: 'Clientes', element: ClientePage },
  { path: '/empresa/listar', name: 'Empresa', element: EmpresaPage },
  { path: '/items/listar', name: 'Items', element: ItemPage },
  { path: '/historial-visitas', name: 'Historial de Visitas', element: HistorialVisitasRestaurantPage }
]

export default routes
