import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const ItemPage = () => {
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
  ]

  const fields = [
    {
      key: 'nombre',
      label: 'Nombre del item',
      type: 'text',
      placeholder: 'Ej: Sueldo básico',
      required: true,
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ej: Item ubicado en la categoría de sueldos',
    }
  ]

  const titulos = {
    crear: 'Nuevo Item',
    editar: 'Modificar Item',
    ver: 'Detalle del Item',
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/itemReciboDeSueldo`}
      tituloLista="Lista de Items"
      titulos={titulos}
      columns={columns}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Seguro que desea eliminar el item <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Item"
      tamanioPagina={10}
    />
  )
}

export default ItemPage
