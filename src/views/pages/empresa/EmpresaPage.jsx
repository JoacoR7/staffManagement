import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const EmpresaPage = () => {
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'telefono',
      label: 'Teléfono',
    },
    {
      key: 'correoElectronico',
      label: 'Correo Electrónico',
    },
  ]

  const fields = [
    {
      key: 'nombre',
      label: 'Nombre de la empresa',
      type: 'text',
      placeholder: 'Ej: Async',
      required: true,
    },
    {
      key: 'telefono',
      label: 'Telefono de la empresa',
      type: 'text',
      placeholder: 'Ej: 2613403332',
      required: true,
    },
    {
      key: 'correoElectronico',
      label: 'Correo de la empresa',
      type: 'text',
      placeholder: 'Ej: async@async.com',
      required: true,
    },
  ]

  const titulos = {
    crear: 'Nueva Empresa',
    editar: 'Modificar Empresa',
    ver: 'Detalle de la Empresa',
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/empresa`}
      tituloLista="Lista de Empresas"
      titulos={titulos}
      columns={columns}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Seguro que desea eliminar la empresa <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Empresa"
      tamanioPagina={10}
    />
  )
}

export default EmpresaPage
