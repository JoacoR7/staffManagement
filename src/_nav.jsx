/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilFastfood, cilGlobeAlt } from '@coreui/icons'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilBasket,
  cilPeople,
  cilBuilding,
  cilSmile,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

/**
 * Navigation menu structure array
 *
 * @type {Array<Object>}
 * @property {React.ComponentType} component - CoreUI nav component (CNavItem, CNavGroup, CNavTitle)
 * @property {string} name - Display text for the nav item
 * @property {string} [to] - Internal route path (for CNavItem with routing)
 * @property {string} [href] - External URL (for CNavItem with external links)
 * @property {React.ReactNode} [icon] - Icon element to display
 * @property {Object} [badge] - Optional badge configuration
 * @property {string} badge.color - Badge color (info, danger, success, etc.)
 * @property {string} badge.text - Badge text content
 * @property {Array<Object>} [items] - Child items for CNavGroup
 *
 * @example
 * // Simple navigation item
 * {
 *   component: CNavItem,
 *   name: 'Dashboard',
 *   to: '/dashboard',
 *   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
 * }
 *
 * @example
 * // Navigation group with children
 * {
 *   component: CNavGroup,
 *   name: 'Base',
 *   to: '/base',
 *   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
 *   items: [
 *     {
 *       component: CNavItem,
 *       name: 'Cards',
 *       to: '/base/cards',
 *     },
 *   ],
 * }
 *
 * @example
 * // Section title
 * {
 *   component: CNavTitle,
 *   name: 'Theme',
 * }
 */
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Direcciones',
    icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pais',
        to: '/paises/listar',
      },
      {
        component: CNavItem,
        name: 'Provincia',
        to: '/provincias/listar',
      },
      {
        component: CNavItem,
        name: 'Departamento',
        to: '/departamentos/listar',
      },
      {
        component: CNavItem,
        name: 'Localidad',
        to: '/localidades/listar',
      },
      {
        component: CNavItem,
        name: 'Dirección',
        to: '/direccion/listar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Carta',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Categoria',
        to: '/categorias/listar',
      },
      {
        component: CNavItem,
        name: 'Carta',
        to: '/cartas/listar',
      },
      {
        component: CNavItem,
        name: 'Menú',
        to: '/menus/listar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Artículos',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Artículos',
        to: '/articulos/listar',
      },
      {
        component: CNavItem,
        name: 'Unidades de medida',
        to: '/unidades-medida/listar',
      },
      {
        component: CNavItem,
        name: 'Promociones',
        to: '/promociones/listar',
      },
      {
        component: CNavItem,
        name: 'Stock',
        to: '/stock/listar',
      },
      {
        component: CNavItem,
        name: 'Movimiento stock',
        to: '/movimientos-stock/listar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Empleados',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Empleados',
        to: '/empleados/listar',
      },
      {
        component: CNavItem,
        name: 'Registro de horarios',
        to: '/registroHorario/listar',
      },
      {
        component: CNavItem,
        name: 'Recibos de sueldo',
        to: '/recibos-de-sueldo/listar',
      },
      {
        component: CNavItem,
        name: 'Items de recibo de sueldo',
        to: '/items/listar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Empresa',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Empresa',
        to: '/empresa/listar',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Clientes',
    icon: <CIcon icon={cilSmile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Clientes',
        to: '/cliente/listar',
      },
      {
        component: CNavItem,
        name: 'Reseñas',
        to: '/resenias/listar',
      },
      {
        component: CNavItem,
        name: 'Historial de Visitas',
        to: '/historial-visitas',
      },
    ],
  },
]

export default _nav
