import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '../../../hooks/useApi'
import { API_URL } from '@/config'

const LocalidadPage = () => {
  const { apiFetch } = useApi()

  const [paises, setPaises] = useState([])
  const [provincias, setProvincias] = useState([])
  const [departamentos, setDepartamentos] = useState([])

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
        return []
      }

      const response = await apiFetch(`${API_URL}/api/v1/provincia/pais/${paisId}`)

      if (!response.ok) return []

      const data = await response.json()

      const provinciasMapeadas = data.map((provincia) => ({
        value: provincia.id,
        label: provincia.nombre,
      }))

      setProvincias(provinciasMapeadas)

      return provinciasMapeadas
    } catch (error) {
      console.error('Error cargando provincias:', error)
      return []
    }
  }

  const cargarDepartamentos = async (provinciaId) => {
    try {
      if (!provinciaId) {
        setDepartamentos([])
        return []
      }

      const response = await apiFetch(
        `${API_URL}/api/v1/departamento/provincia/${provinciaId}`,
      )

      if (!response.ok) return []

      const data = await response.json()

      const departamentosMapeados = data.map((departamento) => ({
        value: departamento.id,
        label: departamento.nombre,
      }))

      setDepartamentos(departamentosMapeados)

      return departamentosMapeados
    } catch (error) {
      console.error('Error cargando departamentos:', error)
      return []
    }
  }

  /**
   * Esto se ejecuta ANTES de abrir el modal de editar/ver.
   * Así ya tenemos país/provincia/departamento cargados y seleccionados.
   */
  const prepararEntidad = async (localidad) => {
    try {
      const paisId = localidad?.departamento?.provincia?.pais?.id
      const provinciaId = localidad?.departamento?.provincia?.id

      if (paisId) {
        await cargarProvincias(paisId)
      }

      if (provinciaId) {
        await cargarDepartamentos(provinciaId)
      }

      return {
        ...localidad,
        paisAuxiliar: paisId,
        provinciaAuxiliar: provinciaId,
      }
    } catch (error) {
      console.error('Error preparando entidad:', error)
      return localidad
    }
  }

  const fields = [
    {
      key: 'paisAuxiliar',
      label: 'País',
      type: 'select',
      options: paises,
      onChangeExtra: async (value) => {
        setDepartamentos([])

        await cargarProvincias(value)
      },
    },
    {
      key: 'provinciaAuxiliar',
      label: 'Provincia',
      type: 'select',
      options: provincias,
      disabled: provincias.length === 0,
      onChangeExtra: async (value) => {
        await cargarDepartamentos(value)
      },
    },
    {
      key: 'departamento',
      label: 'Departamento',
      type: 'select',
      required: true,
      options: departamentos,
      disabled: departamentos.length === 0,
    },
    {
      key: 'nombre',
      label: 'Nombre de la Localidad',
      type: 'text',
      placeholder: 'Ej: Dorrego',
      required: true,
    },
    {
      key: 'codigoPostal',
      label: 'Código Postal',
      type: 'text',
      placeholder: 'Ej: 5501',
      required: true,
    },
  ]

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/localidad`}
      tituloLista="Lista de Localidades"
      titulos={{
        crear: 'Nueva Localidad',
        editar: 'Modificar Localidad',
        ver: 'Detalle de la Localidad',
      }}
      columns={[
        {
          key: 'nombre',
          label: 'Nombre',
        },
        {
          key: 'codigoPostal',
          label: 'Código Postal',
        },
        {
          key: 'departamento.nombre',
          label: 'Departamento',
        },
        {
          key: 'departamento.provincia.nombre',
          label: 'Provincia',
        },
        {
          key: 'departamento.provincia.pais.nombre',
          label: 'País',
        },
      ]}
      fields={fields}
      transformEntity={prepararEntidad}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar la localidad <strong>{item?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Localidad"
    />
  )
}

export default LocalidadPage
