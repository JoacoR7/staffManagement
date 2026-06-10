import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const ReseniasPage = () => {
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
      apiBase={`${API_URL}/api/v1/resenia`}
      tituloLista="Lista de Reseñas"
      titulos={{
        crear: 'Nueva Reseña',
        editar: 'Modificar Reseña',
        ver: 'Detalle de la Reseña',
      }}
      columns={[
        {
        key: 'cliente',
        label: 'Cliente',
        render: (cliente) =>
            cliente ? `${cliente.nombre} ${cliente.apellido}` : '-',
        },
        {
        key: 'fechaResenia',
        label: 'Fecha',
        render: (value) =>
            value
            ? new Date(value).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                })
            : '-',
        }
      ]}
      fields={[
        {
          key: 'observacion',
          label: 'Observación',
          placeholder: 'Ej: Muy buena atención, volveré pronto',
          required: true,
          type: 'textarea',
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
          ¿Estás seguro de que deseas eliminar la reseña{' '}
          <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Reseña"
    />
  )
}

export default ReseniasPage
