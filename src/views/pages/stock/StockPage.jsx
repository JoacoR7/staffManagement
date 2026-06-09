import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const StockPage = () => {
  const [unidades, setUnidades] = useState([])
  
  useEffect(() => {
    cargarUnidades()
  },[])

  const cargarUnidades = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/articulo`,
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
      apiBase={`${API_URL}/api/v1/stock`}
      tituloLista="Lista de stock de productos"
      titulos={{
        crear: 'Nuevo stock de producto',
        editar: 'Modificar stock de producto',
        ver: 'Detalle de stock de producto',
      }}
      columns={[
        { key: 'articulo.nombre', label: 'Artículo' },
        { key: 'cantidadActual', label: 'Cantidad Actual' },
        { key: 'minimo', label: 'Cantidad Mínima' },
      ]}
      fields={[
        {
          key: 'articulo',
          label: 'Artículo',
          type: 'select',
          required: true,
          options: unidades,
        },
        {
          key: 'cantidadActual',
          label: 'Cantidad Actual',
          type: 'number',
          placeholder: 'Ej: 100',
          required: true,
          min: 0,
        },
        {
          key: 'minimo',
          label: 'Cantidad Mínima',
          type: 'number',
          placeholder: 'Ej: 10',
          required: true,
          min: 0,
        }
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el stock del producto{' '}
          <strong>{item?.articulo?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Stock de Producto"
    />
  )
}

export default StockPage