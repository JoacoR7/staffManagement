import React from 'react'
import GenericPage from '../../components/generic/GenericPage'

const PromocionPage = () => (
  <GenericPage
    apiBase="http://localhost:9000/api/v1/promocion"
    tituloLista="Lista de Promociones"
    titulos={{
      crear: 'Nueva Promoción',
      editar: 'Modificar Promoción',
      ver: 'Detalle de la Promoción',
    }}
    columns={[
      {
        key: 'porcentajeDescuento',
        label: 'Porcentaje de Descuento',
        render: (value) => `${value}%`,
      },
      {
        key: 'descripcion',
        label: 'Descripción',
      },
    ]}
    fields={[
      {
        key: 'porcentajeDescuento',
        label: 'Porcentaje de Descuento',
        type: 'number',
        placeholder: 'Ej: 15',
        required: true,
        min: 1,
        max: 100,
        step: 1,
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Ej: Promoción válida en productos seleccionados',
        required: true,
      },
    ]}
    deleteMessage={(item) => (
      <p>
        ¿Estás seguro de que deseas eliminar la promoción con descuento de{' '}
        <strong>{item?.porcentajeDescuento}%</strong>?
      </p>
    )}
    deleteButtonText="Eliminar Promoción"
  />
)

export default PromocionPage
