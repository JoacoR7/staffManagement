import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'

const ClientePage = () => {
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
      apiBase="http://localhost:9000/api/v1/cliente"
      apiCrear="http://localhost:9000/api/v1/cliente/crear"
      cargarDetalle={async (item) => {
        const res = await apiFetch(`http://localhost:9000/api/v1/cliente/${item.id}`)
        const data = await res.json()
        return { ...data, direccionId: data.direccionId }
      }}
      tituloLista="Lista de clientes"
      titulos={{
        crear: 'Nuevo Cliente',
        editar: 'Modificar Cliente',
        ver: 'Detalle del Cliente',
      }}
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'tipoDocumentacion', label: 'Tipo doc.' },
        { key: 'dni', label: 'DNI' },
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
        {
          key: 'esTurista',
          label: '¿Es turista?',
          type: 'checkbox',
        },
        {
          key: 'direccionId',
          label: 'Dirección',
          type: 'select',
          rawValue: true,
          required: true,
          options: direcciones,
          visible: (values) => !values.esTurista,
        },
        {
          key: 'direccionEstadia',
          label: 'Dirección',
          required: true,
          placeholder: 'Ej: Hotel San Martín',
          visible: (values) => values.esTurista,
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
      deleteButtonText="Eliminar Cliente"
    />
  )
}

export default ClientePage
