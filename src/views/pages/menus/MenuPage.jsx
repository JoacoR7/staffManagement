import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import MenuForm from './MenuForm'
import { useApi } from '@/hooks/useApi'
import { API_URL } from '@/config'

const truncate = (text, max = 50) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

const MenuPage = () => {
  const { apiFetch } = useApi()

  const cargarDetalle = async (item) => {
    const response = await apiFetch(`${API_URL}/api/v1/menu/${item.id}`)

    if (!response.ok) {
      throw new Error('Error obteniendo detalle del menú')
    }

    return await response.json()
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/menu`}
      apiCrear={`${API_URL}/api/v1/menu/crear`}
      apiEditar={`${API_URL}/api/v1/menu/editar`}
      apiList={`${API_URL}/api/v1/menu/listado`}
      cargarDetalle={cargarDetalle}
      multipart={true}
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
