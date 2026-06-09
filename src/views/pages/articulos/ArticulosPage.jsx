import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'

const ArticulosPage = () => {
  const [unidades, setUnidades] = useState([])

  useEffect(() => {
    cargarUnidades()
  }, [])

  const cargarUnidades = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log(token)
      const response = await fetch(
        'http://localhost:9000/api/v1/unidadDeMedida',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      const opciones = data.map((u) => ({
        value: u.id,
        label: u.nombre,
      }))

      setUnidades(opciones)
    } catch (error) {
      console.error('Error cargando unidades de medida', error)
    }
  }

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/articulo"
      apiCrear="http://localhost:9000/api/v1/articulo/crear"
      apiEditar="http://localhost:9000/api/v1/articulo/editar"
      multipart={true}
      tituloLista="Lista de Artículos"
      titulos={{
        crear: 'Nuevo Artículo',
        editar: 'Modificar Artículo',
        ver: 'Detalle del Artículo',
      }}
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'sinTAC', label: 'Sin TAC', render: (value) => (value ? 'Sí' : 'No'), },
        { key: 'esIngrediente', label: 'Es Ingrediente', render: (value) => (value ? 'Sí' : 'No'), },
        { key: 'unidadDeMedida.nombre', label: 'Unidad de Medida' },
        {
          key: 'stocks',
          label: 'Stock Actual',
          render: (stocks) => {
            const stockActivo = stocks?.find((s) => !s.eliminado)
            return stockActivo
              ? stockActivo.cantidadActual
              : 'Sin stock'
          },
        },
        {
          key: 'stocks',
          label: 'Stock Mínimo',
          render: (stocks) => {
            const stockActivo = stocks?.find((s) => !s.eliminado)
            return stockActivo
              ? stockActivo.minimo
              : '-'
          },
        },
      ]}
      fields={[
        {
          key: 'nombre',
          label: 'Nombre del Artículo',
          placeholder: 'Ej: Manzana',
          required: true,
        },
        {
          key: 'descripcion',
          label: 'Descripción del Artículo',
          placeholder: 'Manzana roja',
          required: false,
          type: 'textarea',
        },
        {
          key: 'sinTAC',
          label: 'Sin TAC',
          type: 'checkbox',
          required: true,
        },
        {
          key: 'esIngrediente',
          label: 'Es Ingrediente',
          type: 'checkbox',
          required: true,
        },
        {
          key: 'unidadDeMedida',
          label: 'Unidad de Medida',
          type: 'select',
          rawValue: true,
          required: true,
          options: unidades,
        },
        {
          key: 'imagen',
          label: 'Imagen',
          type: 'file',
          previewUrl: (entity) => entity?.imagen?.id
            ? `http://localhost:9000/api/v1/imagen/${entity.imagen.id}`
            : null,
        },
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el artículo{' '}
          <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Artículo"
    />
  )
}

export default ArticulosPage
