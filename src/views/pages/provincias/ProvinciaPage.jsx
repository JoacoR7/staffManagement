import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '../../../hooks/useApi'
const ProvinciaPage = () => {
  const { apiFetch } = useApi()

  const [paisesOptions, setPaisesOptions] = useState([])

  useEffect(() => {
    cargarPaises()
  }, [])

  const cargarPaises = async () => {
    try {
      const response = await apiFetch('http://localhost:9000/api/v1/pais')

      if (!response.ok) return

      const data = await response.json()

      const options = data.map((pais) => ({
        value: pais.id,
        label: pais.nombre,
      }))

      setPaisesOptions(options)
    } catch (error) {
      console.error('Error cargando países:', error)
    }
  }

  const fields = [
    {
      key: 'nombre',
      label: 'Nombre de la Provincia',
      type: 'text',
      placeholder: 'Ej: Mendoza',
      required: true,
    },
    {
      key: 'pais',
      label: 'País',
      type: 'select',
      required: true,
      options: paisesOptions,
    },
  ]

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/provincia"
      tituloLista="Lista de Provincias"
      titulos={{
        crear: 'Nueva Provincia',
        editar: 'Modificar Provincia',
        ver: 'Detalle de la Provincia',
      }}
      columns={[
        {
          key: 'nombre',
          label: 'Nombre',
        },
        {
          key: 'pais.nombre',
          label: 'País',
        },
      ]}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar la provincia <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Provincia"
    />
  )
}

export default ProvinciaPage
