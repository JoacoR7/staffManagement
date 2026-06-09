import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const DireccionPage = () => {
  const [paises, setPaises] = useState([])
  const [provincias, setProvincias] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [localidades, setLocalidades] = useState([])

  useEffect(() => {
    cargarPaises()
  }, [])

  const cargarPaises = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/pais`,
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

      setPaises(opciones)
    } catch (error) {
      console.error('Error cargando paises', error)
    }
  }

  const cargarProvincias = async (paisId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/provincia/pais/${paisId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      const opciones = data.map((p) => ({ value: p.id, label: p.nombre }))
      setProvincias(opciones)
      setDepartamentos([])
      setLocalidades([])
      return opciones  // <-- retornar
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const cargarDepartamentos = async (provinciaId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/departamento/provincia/${provinciaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      const opciones = data.map((d) => ({ value: d.id, label: d.nombre }))
      setDepartamentos(opciones)
      setLocalidades([])
      return opciones  // <-- retornar
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const cargarLocalidades = async (departamentoId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/v1/localidad/departamento/${departamentoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      const opciones = data.map((l) => ({ value: l.id, label: l.nombre }))
      setLocalidades(opciones)
      return opciones  // <-- retornar
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const prepararEntidad = async (direccion) => {
    try {
      const paisId         = direccion?.localidad?.departamento?.provincia?.pais?.id
      const provinciaId    = direccion?.localidad?.departamento?.provincia?.id
      const departamentoId = direccion?.localidad?.departamento?.id
      const localidadId    = direccion?.localidad?.id

      // Cargamos en paralelo secuencial y capturamos los resultados
      let opcionesProvincias    = []
      let opcionesDepartamentos = []
      let opcionesLocalidades   = []

      if (paisId) {
        opcionesProvincias = await cargarProvincias(paisId)
      }
      if (provinciaId) {
        opcionesDepartamentos = await cargarDepartamentos(provinciaId)
      }
      if (departamentoId) {
        opcionesLocalidades = await cargarLocalidades(departamentoId)
      }

      // Forzamos el estado con los valores correctos
      setProvincias(opcionesProvincias)
      setDepartamentos(opcionesDepartamentos)
      setLocalidades(opcionesLocalidades)

      return {
        ...direccion,
        pais:         paisId,
        provincia:    provinciaId,
        departamento: departamentoId,
        localidad:    localidadId,
      }
    } catch (error) {
      console.error('ERROR prepararEntidad', error)
      throw error
    }
  }

  const fields = [
        {
          key: 'pais',
          label: 'País',
          type: 'select',
          options: paises,
          required: true,
          onChangeExtra: cargarProvincias,
          skipInitExtra: true,
        },
        {
          key: 'provincia',
          label: 'Provincia',
          type: 'select',
          options: provincias,
          required: true,
          onChangeExtra: cargarDepartamentos,
          disabled: provincias.length === 0,
          skipInitExtra: true,
        },
        {
          key: 'departamento',
          label: 'Departamento',
          type: 'select',
          options: departamentos,  
          required: true,
          onChangeExtra: cargarLocalidades,
          disabled: departamentos.length === 0,
          skipInitExtra: true,
        },
        {
          key: 'localidad',
          label: 'Localidad',
          type: 'select',
          options: localidades,  
          required: true,
          disabled: localidades.length === 0,
        },
        {
          key: 'calle',
          label: 'Nombre de la Calle',
          placeholder: 'Ej: Avenida San Martín',
          required: true,
        },
        {
          key: 'numeracion',
          label: 'Numeración',
          placeholder: 'Ej: 123',
          required: true,
          type: 'text',
        },
        {
          key: 'barrio',
          label: 'Barrio',
          placeholder: 'Ej: San Juan',
          required: true,
          type: 'text',
        },
        {
          key: 'manzanaPiso',
          label: 'Manzana/Piso',
          placeholder: 'Ej: Manzana 5 / Piso 3',
          required: true,
          type: 'text',
        },
        {
          key: 'casaDepartamento',
          label: 'Casa/Departamento',
          placeholder: 'Ej: Casa 10 / Departamento 2',
          required: true,
          type: 'text',
        },
        {
          key: 'referencia',
          label: 'Referencia',
          placeholder: 'Ej: Al lado del banco',
          required: true,
          type: 'textarea',
        },
      ]




  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/direccion`}
      tituloLista="Lista de Direcciones"
      titulos={{
        crear: 'Nueva Dirección',
        editar: 'Modificar Dirección',
        ver: 'Detalle de la Dirección',
      }}
      columns={[
        { key: 'localidad.nombre', label: 'Localidad' },
        { key: 'calle', label: 'Calle' },
        { key: 'numeracion', label: 'Numeración' },
        { key: 'barrio', label: 'Barrio' },
        { key: 'manzanaPiso', label: 'Manzana/Piso' },
        { key: 'casaDepartamento', label: 'Casa/Departamento' },
      ]}
      fields={fields}
      transformEntity={prepararEntidad}
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

export default DireccionPage