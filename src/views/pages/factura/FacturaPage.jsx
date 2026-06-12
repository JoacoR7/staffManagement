import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'
import { CBadge } from '@coreui/react'
import FacturaForm from './FacturaForm'

const mapeoEstadoFactura = {
  PAGADA: { color: 'success', label: 'Pagada' },
  ANULADA: { color: 'secondary', label: 'Anulada' },
  SIN_DEFINIR: { color: 'warning', label: 'Sin Definir' },
}

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '-'
  try {
    const date = new Date(fechaISO)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return fechaISO
  }
}

const formatearMoneda = (valor) => {
  if (valor == null) return '-'
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const FacturaPage = () => (
  <GenericPage
    apiBase={`${API_URL}/api/v1/factura`}
    tituloLista="Lista de Facturas"
    titulos={{
      crear: 'Nueva Factura',
      editar: 'Modificar Factura',
      ver: 'Detalle de Factura',
    }}
    permitirCrear={false}
    permitirEditar={false}
    permitirBorrar={false}
    columns={[
      {
        key: 'numeroFactura',
        label: 'N° Factura',
      },
      {
        key: 'fechaFactura',
        label: 'Fecha',
        render: (val) => formatearFecha(val),
      },
      {
        key: 'totalPagado',
        label: 'Total',
        render: (val) => formatearMoneda(val),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (val) => {
          const config = mapeoEstadoFactura[val] || { color: 'dark', label: val }
          return <CBadge color={config.color}>{config.label}</CBadge>
        },
      },
      {
        key: 'detalles',
        label: 'Comandas',
        render: (detalles) => {
          if (!detalles || detalles.length === 0) return '-'
          return `${detalles.length} comanda${detalles.length !== 1 ? 's' : ''}`
        },
      },
    ]}
    cargarDetalle={async (item) => {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/v1/factura/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return await res.json()
    }}
    renderForm={(props) => <FacturaForm {...props} />}
  />
)

export default FacturaPage
