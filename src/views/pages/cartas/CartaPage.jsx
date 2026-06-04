import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import CartaForm from './CartaForm'
import { useApi } from '@/hooks/useApi'

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
        },
        {
          key: 'fechaHasta',
          label: 'Fecha Hasta',
        },
      ]}
      renderForm={(props) => <CartaForm {...props} />}
      deleteMessage={(item) => (
        <p>
          ¿Está seguro de eliminar la carta con vigencia desde <strong>{item?.fechaDesde}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Carta"
    />
  )
}

export default CartaPage
