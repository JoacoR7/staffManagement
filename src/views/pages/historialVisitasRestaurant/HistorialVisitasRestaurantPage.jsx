import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const HistorialVisitasRestaurantPage = () => {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/cliente`,
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
        label: u.nombre + ' ' + u.apellido,
      }))

      setClientes(opciones)
    } catch (error) {
      console.error('Error cargando clientes', error)
    }
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/historial-visitas-restaurant`}
      tituloLista="Lista de Historial de Visitas"
      titulos={{
        crear: 'Nueva Visita',
        editar: 'Modificar Visita',
        ver: 'Detalle de la Visita',
      }}
      columns={[
        {
        key: 'cliente',
        label: 'Cliente',
        render: (cliente) =>
            cliente ? `${cliente.nombre} ${cliente.apellido}` : '-',
        },
        {
        key: 'cantidadVisita',
        label: 'Cantidad de visitas',
        render: (value) => value ?? 0,
        },
      ]}
      fields={[
        {
          key: 'cantidadVisita',
          label: 'Cantidad de Visitas',
          type: 'counter',
          defaultValue: 0,
          min: 0,
        },
        {
          key: 'cliente',
          label: 'Cliente',
          type: 'select',
          required: true,
          options: clientes,
        },
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el historial de visita{' '}
          <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Historial de Visita"
    />
  )
}

export default HistorialVisitasRestaurantPage
