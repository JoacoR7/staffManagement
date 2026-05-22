import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'
import { cilCloudUpload } from '@coreui/icons'

const RegistroHorarioPage = () => {
  const { apiFetch } = useApi()
  const [empleados, setEmpleados] = useState([])

  useEffect(() => {
    apiFetch('http://localhost:9000/api/v1/empleado')
      .then((res) => res.json())
      .then((data) =>
        setEmpleados(data.map((e) => ({ value: e.id, label: `${e.nombre} ${e.apellido}` }))),
      )
      .catch(() => {})
  }, [])

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/registroHorario"
      tituloLista="Lista de ingresos y egresos"
      titulos={{
        editar: 'Modificar Registro',
        ver: 'Detalle del Registro',
      }}
      columns={[
        {
          key: 'empleado',
          label: 'Empleado',
          render: (value) => (value ? `${value.nombre} ${value.apellido}` : ''),
        },
        {
          key: 'fechaEntrada',
          label: 'Fecha de entrada',
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
              : '',
        },
        {
          key: 'fechaSalida',
          label: 'Fecha de salida',
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
              : '',
        },
        { key: 'estadoRegistroHorario', label: 'Estado' },
        { key: 'observacion', label: 'Observación' },
      ]}
      accionesExtra={[
        {
          label: 'Subir justificación',
          icon: cilCloudUpload,
          onClick: (item) => console.log('subir justificacion', item),
        },
      ]}
      fields={[
        {
          key: 'fechaEntrada',
          label: 'Fecha de entrada',
          type: 'datetime-local',
          required: true,
        },
        {
          key: 'fechaSalida',
          label: 'Fecha de salida',
          type: 'datetime-local',
          required: false,
        },
        {
          key: 'empleado',
          label: 'Empleado',
          type: 'select',
          required: true,
          options: empleados,
        },
        {
          key: 'estadoRegistroHorario',
          label: 'Estado',
          type: 'select',
          required: true,
          options: [
            { value: 'PRESENTE', label: 'Presente' },
            { value: 'AUSENTE', label: 'Ausente' },
          ],
        },
        {
          key: 'observacion',
          label: 'Observación',
          type: 'textarea',
          required: false,
        },
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el registro del <strong>{item?.fechaEntrada}</strong>
          ?
        </p>
      )}
      deleteButtonText="Eliminar Registro"
      permitirCrear={false}
    />
  )
}

export default RegistroHorarioPage
