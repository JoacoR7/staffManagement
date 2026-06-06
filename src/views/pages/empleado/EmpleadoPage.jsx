import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'

const EmpleadoPage = () => {
  const { apiFetch } = useApi()
  const [direcciones, setDirecciones] = useState([])

  useEffect(() => {
    apiFetch('http://localhost:9000/api/v1/direccion')
      .then((res) => res.json())
      .then((data) => {
        const lista = Array.isArray(data) ? data : data.content || []
        setDirecciones(
          lista.map((l) => ({
            value: l.id,
            label: `${l.calle} ${l.numeracion ?? ''} - ${l.barrio}`,
          }))
        )
      })
      .catch(() => {})
  }, [])

  return (
    <GenericPage
      apiBase="http://localhost:9000/api/v1/empleado"
      apiCrear="http://localhost:9000/api/v1/empleado/crear"
      cargarDetalle={async (item) => {
        const res = await apiFetch(`http://localhost:9000/api/v1/empleado/${item.id}`)
        const data = await res.json()
        return { ...data, direccionId: data.direccion?.id }
      }}
      multipart={true}
      tituloLista="Lista de empleados"
      titulos={{
        crear: 'Nuevo Empleado',
        editar: 'Modificar Empleado',
        ver: 'Detalle del Empleado',
      }}
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'tipoDocumentacion', label: 'Tipo doc.' },
        { key: 'dni', label: 'DNI' },
        { key: 'tipoEmpleado', label: 'Tipo empleado' },
        {
          key: 'email',
          label: 'Email',
          render: (_, item) => item.contacto?.find((c) => c.email)?.email ?? '-',
        },
      ]}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true },
        { key: 'apellido', label: 'Apellido', required: true },
        {
          key: 'tipoDocumentacion',
          label: 'Tipo de documentación',
          type: 'select',
          rawValue: true,
          required: true,
          options: [
            { value: 'DOCUMENTO_IDENTIDAD', label: 'Documento de identidad' },
            { value: 'CARNET_DE_CONDUCIR', label: 'Carnet de conducir' },
          ],
        },
        { key: 'dni', label: 'DNI', required: true },
        { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
        { key: 'foto', label: 'Foto de perfil', type: 'file' },
        {
          key: 'tipoEmpleado',
          label: 'Tipo de empleado',
          type: 'select',
          rawValue: true,
          required: true,
          options: [
            { value: 'ADMINISTRATIVO', label: 'Administrativo' },
            { value: 'MOZO', label: 'Mozo' },
            { value: 'DELIVERY', label: 'Delivery' },
            { value: 'COCINERO', label: 'Cocinero' },
          ],
        },
        {
          key: 'tipoContacto',
          label: 'Tipo de contacto',
          type: 'select',
          rawValue: true,
          required: true,
          options: [
            { value: 'PERSONAL', label: 'Personal' },
            { value: 'LABORAL', label: 'Laboral' },
            { value: 'EMPRESA', label: 'Empresa' },
          ],
        },
        { key: 'email', label: 'Email', type: 'email', required: true },
        {
          key: 'tipoTelefono',
          label: 'Tipo de teléfono',
          type: 'select',
          rawValue: true,
          required: true,
          options: [
            { value: 'FIJO', label: 'Fijo' },
            { value: 'CELULAR', label: 'Celular' },
          ],
        },
        { key: 'contactoTelefono', label: 'Teléfono', required: true },
        { key: 'observacion', label: 'Observación', type: 'textarea' },
        { key: 'password', label: 'Contraseña', type: 'password', required: true },
        {
          key: 'rol',
          label: 'Rol',
          type: 'select',
          rawValue: true,
          required: true,
          options: [
            { value: 'ADMINISTRATIVO', label: 'Administrativo' },
            { value: 'MOZO', label: 'Mozo' },
            { value: 'CLIENTE', label: 'Cliente' },
            { value: 'COCINERO', label: 'Cocinero' },
          ],
        },
        {
          key: 'direccionId',
          label: 'Dirección',
          type: 'select',
          rawValue: true,
          required: true,
          options: direcciones,
        },
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar a{' '}
          <strong>
            {item?.nombre} {item?.apellido}
          </strong>
          ?
        </p>
      )}
      deleteButtonText="Eliminar Empleado"
    />
  )
}

export default EmpleadoPage
