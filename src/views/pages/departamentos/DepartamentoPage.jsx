import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '../../../hooks/useApi'
import { API_URL } from '@/config'

const DepartamentoPage = () => {
  const { apiFetch } = useApi()

  const [paises, setPaises] = useState([])
  const [provincias, setProvincias] = useState([])

  useEffect(() => {
    cargarPaises()
  }, [])

  const cargarPaises = async () => {
    try {
      const response = await apiFetch(`${API_URL}/api/v1/pais`)

      if (!response.ok) return

      const data = await response.json()

      setPaises(
        data.map((pais) => ({
          value: pais.id,
          label: pais.nombre,
        })),
      )
    } catch (error) {
      console.error('Error cargando países:', error)
    }
  }

  const cargarProvincias = async (paisId) => {
    try {
      if (!paisId) {
        setProvincias([])
        return
      }

      const response = await apiFetch(`${API_URL}/api/v1/provincia/pais/${paisId}`)

      if (!response.ok) return

      const data = await response.json()

      setProvincias(
        data.map((provincia) => ({
          value: provincia.id,
          label: provincia.nombre,
        })),
      )
    } catch (error) {
      console.error('Error cargando provincias:', error)
    }
  }

  const fields = [
    {
      key: 'paisAuxiliar',
      label: 'País',
      type: 'select',
      options: paises,
      initialValue: (entity) => entity?.provincia?.pais?.id || '',
      onChangeExtra: (value) => {
        cargarProvincias(value)
      },
    },
    {
      key: 'provincia',
      label: 'Provincia',
      type: 'select',
      required: true,
      options: provincias,
      disabled: provincias.length === 0,
    },
    {
      key: 'nombre',
      label: 'Nombre del Departamento',
      type: 'text',
      placeholder: 'Ej: Guaymallén',
      required: true,
    },
  ]

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/departamento`}
      tituloLista="Lista de Departamentos"
      titulos={{
        crear: 'Nuevo Departamento',
        editar: 'Modificar Departamento',
        ver: 'Detalle del Departamento',
      }}
      columns={[
        {
          key: 'nombre',
          label: 'Nombre',
        },
        {
          key: 'provincia.nombre',
          label: 'Provincia',
        },
        {
          key: 'provincia.pais.nombre',
          label: 'País',
        },
      ]}
      fields={fields}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el departamento <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Departamento"
    />
  )
}

export default DepartamentoPage
