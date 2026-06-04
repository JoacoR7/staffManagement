import React from 'react'
import GenericPage from '../../components/generic/GenericPage'

const CategoriaPage = () => {
  const fields = [
    {
      key: 'nombre',
      label: 'Nombre de la Categoría',
      type: 'text',
      placeholder: 'Ej: Bebidas',
      required: true,
    },
  ]

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/categoria"
      tituloLista="Lista de Categorías"
      titulos={{
        crear: 'Nueva Categoría',
        editar: 'Modificar Categoría',
        ver: 'Detalle de la Categoría',
      }}
      columns={[
        {
          key: 'nombre',
          label: 'Nombre',
        },
      ]}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar la categoría <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Categoría"
    />
  )
}

export default CategoriaPage
