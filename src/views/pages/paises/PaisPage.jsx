import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const PaisPage = () => {
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
  ]

  const fields = [
    {
      key: 'nombre',
      label: 'Nombre del País',
      type: 'text',
      placeholder: 'Ej: Argentina',
      required: true,
    },
  ]

  const titulos = {
    crear: 'Nuevo País',
    editar: 'Modificar País',
    ver: 'Detalle del País',
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/pais`}
      tituloLista="Lista de Países"
      titulos={titulos}
      columns={columns}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Seguro que desea eliminar el país <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar País"
      tamanioPagina={10}
    />
  )
}

export default PaisPage
