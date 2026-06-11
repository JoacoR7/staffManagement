import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const UnidadesDeMedidaPage = () => (
  <GenericPage
    apiBase={`${API_URL}/api/v1/unidadDeMedida`}
    tituloLista="Lista de Unidades de Medida"
    titulos={{
      crear: 'Nueva Unidad de Medida',
      editar: 'Modificar Unidad de Medida',
      ver: 'Detalle de la Unidad de Medida',
    }}
    columns={[
      { key: 'nombre', label: 'Nombre' },
    ]}
    fields={[
      {
        key: 'nombre',
        label: 'Nombre de la Unidad de Medida',
        placeholder: 'Ej: Kilogramo',
        required: true,
      },
    ]}
    deleteMessage={(item) => (
      <p>
        ¿Estás seguro de que deseas eliminar la unidad de medida{' '}
        <strong>{item?.nombre}</strong>?
      </p>
    )}
    deleteButtonText="Eliminar Unidad de Medida"
  />
)

export default UnidadesDeMedidaPage