import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'
import { API_URL } from '@/config'
import ReciboForm from './ReciboForm'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  try {
    const [anio, mes, dia] = fecha.slice(0, 10).split('-')
    return `${dia}/${mes}/${anio}`
  } catch {
    return fecha
  }
}

const formatearMoneda = (valor) => {
  if (valor == null) return '-'
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const ReciboPage = () => {
  const { apiFetch } = useApi()
  const [empleados, setEmpleados] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    cargarEmpleados()
    cargarItems()
  }, [])

  const cargarEmpleados = async () => {
    try {
      const res = await apiFetch(`${API_URL}/api/v1/empleado`)
      if (!res) return
      const data = await res.json()
      setEmpleados((data || []).map((e) => ({ value: e.id, label: `${e.nombre} ${e.apellido}` })))
    } catch {}
  }

  const cargarItems = async () => {
    try {
      const res = await apiFetch(`${API_URL}/api/v1/itemReciboDeSueldo`)
      if (res) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.content || []
        setItems(list.map((i) => ({ value: i.id, label: i.nombre })))
      }
    } catch {}
  }


  const columns = [
    {
      key: 'fechaDePago',
      label: 'Fecha de Pago',
      render: (val) => formatearFecha(val),
    },
    {
      key: 'mesPago',
      label: 'Mes',
      render: (val) => meses[val - 1] || val,
    },
    {
      key: 'empleado',
      label: 'Empleado',
      render: (emp, item) => {
        if (item?.empleadoNombre) {
          return `${item.empleadoNombre} ${item.empleadoApellido || ''}`
        }
        return emp ? `${emp.nombre} ${emp.apellido}` : '-'
      },
    },
    {
      key: 'totalPago',
      label: 'Total',
      render: (val) => formatearMoneda(val),
    },
    {
      key: 'observacion',
      label: 'Observación',
      render: (val) => val || '-',
    },
  ]

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/reciboDeSueldo`}
      tituloLista="Lista de Recibos de Sueldo"
      columns={columns}

      tamanioPagina={10}
      deleteButtonText="Eliminar Recibo"
      deleteMessage={(item) => {
        const nombreEmpleado = item?.empleadoNombre
          ? `${item.empleadoNombre} ${item.empleadoApellido || ''}`
          : item?.empleado
            ? `${item.empleado.nombre} ${item.empleado.apellido}`
            : ''
        return (
          <p>
            ¿Estás seguro de que deseas eliminar el recibo de sueldo de{' '}
            <strong>{nombreEmpleado}</strong> con fecha{' '}
            <strong>{item?.fechaDePago ? formatearFecha(item.fechaDePago) : ''}</strong>?
          </p>
        )
      }}
      cargarDetalle={async (item) => {
        const res = await apiFetch(`${API_URL}/api/v1/reciboDeSueldo/${item.id}`)
        return await res.json()
      }}
      renderForm={(props) => (
        <ReciboForm
          {...props}
          onGuardar={(payload) => {
            // Adaptar el payload al formato esperado por ReciboDeSueldoRequestDTO en el backend (tanto para crear como editar)
            const dtoPayload = {
              empleadoId: payload.empleado?.id,
              fechaDePago: payload.fechaDePago,
              mesPago: payload.mesPago,
              observacion: payload.observacion,
              detalles: (payload.detalles || []).map((d) => ({
                cantidad: d.cantidad,
                valor: d.valor,
                tipoDetalleRecibo: d.tipoDetalleRecibo,
                itemReciboDeSueldoId: d.itemReciboDeSueldo?.id,
              })),
            }
            props.onGuardar(dtoPayload)
          }}
          empleados={empleados}
          items={items}
          formatearMoneda={formatearMoneda}
        />
      )}
    />
  )
}

export default ReciboPage
