import React from 'react'
import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilStar } from '@coreui/icons'
import GenericPage from '../../components/generic/GenericPage'
import CartaForm from './CartaForm'
import { useApi } from '@/hooks/useApi'

const formatFecha = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

const CartaPage = () => {
  const { apiFetch } = useApi()

  const cargarDetalle = async (item) => {
    const response = await apiFetch(`http://localhost:9000/api/v1/carta/${item.id}`)

    if (!response.ok) {
      throw new Error('Error obteniendo detalle de la carta')
    }

    return await response.json()
  }

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/carta"
      apiCrear="http://localhost:9000/api/v1/carta/crear"
      apiEditar={'http://localhost:9000/api/v1/carta/editar'}
      apiList="http://localhost:9000/api/v1/carta/listado"
      cargarDetalle={cargarDetalle}
      tituloLista="Lista de Cartas"
      titulos={{
        crear: 'Nueva Carta',
        editar: 'Modificar Carta',
        ver: 'Detalle de la Carta',
      }}
      columns={[
        {
          key: 'nombre',
          label: 'Nombre',
        },
        {
          key: 'fechaDesde',
          label: 'Fecha Desde',
          render: (value) => formatFecha(value),
        },
        {
          key: 'fechaHasta',
          label: 'Fecha Hasta',
          render: (value) => formatFecha(value),
        },
        {
          key: 'activo',
          label: 'Activa',
          render: (value) =>
            value ? (
              <CBadge color="success" shape="rounded-pill">
                Sí
              </CBadge>
            ) : (
              <CBadge color="secondary" shape="rounded-pill">
                No
              </CBadge>
            ),
        },
      ]}
      accionesExtra={[
        {
          label: 'Activar',
          icon: cilStar,
          condition: (item) => !item.activo,
          onClick: async (item) => {
            const response = await apiFetch(
              `http://localhost:9000/api/v1/carta/${item.id}/activar`,
              { method: 'PUT' },
            )
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.error || 'No se pudo activar la carta')
            }
          },
        },
      ]}
      renderForm={(props) => <CartaForm {...props} />}
      deleteMessage={(item) => (
        <p>
          ¿Está seguro de eliminar la carta con vigencia desde{' '}
          <strong>{formatFecha(item?.fechaDesde)}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Carta"
    />
  )
}

export default CartaPage
