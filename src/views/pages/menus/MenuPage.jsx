import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import MenuForm from './MenuForm'
import { useApi } from '@/hooks/useApi'

const truncate = (text, max = 50) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

const MenuPage = () => {
  const { apiFetch } = useApi()

  const cargarDetalle = async (item) => {
    const response = await apiFetch(`http://localhost:9000/api/v1/menu/${item.id}`)

    if (!response.ok) {
      throw new Error('Error obteniendo detalle del menú')
    }

    return await response.json()
  }

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/menu"
      apiCrear="http://localhost:9000/api/v1/menu/crear"
      apiEditar="http://localhost:9000/api/v1/menu/editar"
      apiList="http://localhost:9000/api/v1/menu/listado"
      cargarDetalle={cargarDetalle}
      tituloLista="Lista de Menús"
      titulos={{
        crear: 'Nuevo Menú',
        editar: 'Modificar Menú',
        ver: 'Detalle del Menú',
      }}
      columns={[
        { key: 'nombre', label: 'Nombre' },
        {
          key: 'descripcion',
          label: 'Descripción',
          render: (value) => truncate(value, 50),
        },
        {
          key: 'precio',
          label: 'Precio',
          render: (value) => `$${Number(value ?? 0).toFixed(2)}`,
        },
      ]}
      renderForm={(props) => <MenuForm {...props} />}
      deleteMessage={(item) => (
        <p>
          ¿Está seguro de eliminar el menú <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Menú"
    />
  )
}

export default MenuPage
