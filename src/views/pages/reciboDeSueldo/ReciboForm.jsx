import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import ConfirmModal from '@/components/ConfirmModal'
import ReciboDetallesTable from './ReciboDetallesTable'
import DetalleModal from './DetalleModal'

const meses = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

const ReciboForm = ({
  modo,
  entity,
  onClose,
  onGuardar,
  manejarError,
  empleados,
  items,
  formatearMoneda,
}) => {
  const [formData, setFormData] = useState({
    fechaDePago: '',
    mesPago: '',
    observacion: '',
    empleadoId: '',
    tipoPago: 'CREDITO',
  })
  const [detalles, setDetalles] = useState([])
  const [detalleModalVisible, setDetalleModalVisible] = useState(false)
  const [detalleEditando, setDetalleEditando] = useState(null)
  const [detalleIndex, setDetalleIndex] = useState(-1)
  const [confirmandoDetalle, setConfirmandoDetalle] = useState(null)

  const soloLectura = modo === 'ver'
  const totalCalculado = detalles.reduce((sum, d) => sum + (Number(d.cantidad) || 0) * (Number(d.valor) || 0), 0)

  useEffect(() => {
    if (entity) {
      setFormData({
        fechaDePago: entity.fechaDePago ? entity.fechaDePago.slice(0, 10) : '',
        mesPago: entity.mesPago ?? '',
        observacion: entity.observacion ?? '',
        empleadoId: entity.empleadoId ?? entity.empleado?.id ?? '',
        tipoPago: entity.detalles?.[0]?.tipoDetalleRecibo || 'CREDITO',
      })
      setDetalles((entity.detalles || []).map((d) => ({
        id: d.id,
        cantidad: d.cantidad,
        valor: d.valor,
        tipoDetalleRecibo: d.tipoDetalleRecibo || 'CREDITO',
        itemId: d.itemReciboDeSueldoId || d.itemReciboDeSueldo?.id || d.item?.id || '',
        itemNombre: d.itemReciboDeSueldoNombre || d.itemReciboDeSueldo?.nombre || d.item?.nombre || '',
      })))
    } else {
      setFormData({
        fechaDePago: '',
        mesPago: '',
        observacion: '',
        empleadoId: '',
        tipoPago: 'CREDITO',
      })
      setDetalles([])
    }
  }, [entity])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const guardar = () => {
    if (!formData.empleadoId) {
      manejarError('Debe seleccionar un empleado')
      return
    }
    if (!formData.fechaDePago) {
      manejarError('Debe indicar la fecha de pago')
      return
    }
    if (!detalles.length) {
      manejarError('Debe agregar al menos un detalle')
      return
    }

    for (let i = 0; i < detalles.length; i++) {
      const d = detalles[i]
      if (!d.itemId) {
        manejarError(`El detalle #${i + 1} debe tener un item de recibo de sueldo seleccionado.`)
        return
      }
      if (d.cantidad === undefined || d.cantidad === null || isNaN(d.cantidad) || Number(d.cantidad) <= 0) {
        manejarError(`La cantidad en el detalle #${i + 1} debe ser mayor a 0 y un número válido.`)
        return
      }
      if (d.valor === undefined || d.valor === null || isNaN(d.valor) || Number(d.valor) <= 0) {
        manejarError(`El valor en el detalle #${i + 1} debe ser mayor a 0 y un número válido.`)
        return
      }
      const tipo = d.tipoDetalleRecibo || formData.tipoPago
      if (!tipo || (tipo !== 'CREDITO' && tipo !== 'DEBITO')) {
        manejarError(`El tipo en el detalle #${i + 1} debe ser CREDITO o DEBITO.`)
        return
      }
    }

    const fechaISO = new Date(formData.fechaDePago + 'T00:00:00.000Z').toISOString().replace('Z', '+00:00')

    const payload = {
      empleado: { id: formData.empleadoId },
      fechaDePago: fechaISO,
      mesPago: formData.mesPago ? Number(formData.mesPago) : 0,
      observacion: formData.observacion || '',
      detalles: detalles.map((d) => {
        const itemDetalle = {
          cantidad: Number(d.cantidad),
          valor: Number(d.valor),
          tipoDetalleRecibo: d.tipoDetalleRecibo || formData.tipoPago || 'CREDITO',
          itemReciboDeSueldo: { id: d.itemId },
        }
        if (modo !== 'crear' && d.id) {
          itemDetalle.id = d.id
        }
        return itemDetalle
      }),
    }
    onGuardar(payload)
  }

  const abrirNuevoDetalle = () => {
    setDetalleEditando({ itemId: '', cantidad: 1, valor: 0 })
    setDetalleIndex(-1)
    setDetalleModalVisible(true)
  }

  const abrirEditarDetalle = (index) => {
    setDetalleEditando({ ...detalles[index] })
    setDetalleIndex(index)
    setDetalleModalVisible(true)
  }

  const handleDetalleChange = (field, value) => {
    setDetalleEditando((prev) => ({ ...prev, [field]: value }))
  }

  const confirmarDetalle = () => {
    if (!detalleEditando.itemId) {
      manejarError('Debe seleccionar un item')
      return
    }
    if (
      detalleEditando.cantidad === undefined ||
      detalleEditando.cantidad === null ||
      isNaN(detalleEditando.cantidad) ||
      Number(detalleEditando.cantidad) <= 0
    ) {
      manejarError('La cantidad debe ser mayor a 0 y un número válido')
      return
    }
    if (
      detalleEditando.valor === undefined ||
      detalleEditando.valor === null ||
      isNaN(detalleEditando.valor) ||
      Number(detalleEditando.valor) <= 0
    ) {
      manejarError('El valor debe ser mayor a 0 y un número válido')
      return
    }

    const itemNombre = items.find((i) => i.value === detalleEditando.itemId)?.label || ''
    const detallePayload = { ...detalleEditando, itemNombre, tipoDetalleRecibo: formData.tipoPago }

    if (detalleIndex === -1) {
      setDetalles((prev) => [...prev, detallePayload])
    } else {
      setDetalles((prev) => {
        const copy = [...prev]
        copy[detalleIndex] = detallePayload
        return copy
      })
    }
    setDetalleModalVisible(false)
  }

  const eliminarDetalle = () => {
    setDetalles((prev) => prev.filter((_, i) => i !== confirmandoDetalle))
    setConfirmandoDetalle(null)
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>
          {modo === 'crear' ? 'Nuevo Recibo de Sueldo' : modo === 'editar' ? 'Modificar Recibo de Sueldo' : 'Detalle del Recibo de Sueldo'}
        </strong>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormLabel>Empleado <span className="text-danger">*</span></CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.empleadoId}
            onChange={(e) => handleChange('empleadoId', e.target.value)}
          >
            <option value="">-- Seleccionar empleado --</option>
            {empleados.map((emp) => (
              <option key={emp.value} value={emp.value}>
                {emp.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Fecha de Pago <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            type="date"
            disabled={soloLectura}
            value={formData.fechaDePago}
            onChange={(e) => handleChange('fechaDePago', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <CFormLabel>Mes</CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.mesPago}
            onChange={(e) => handleChange('mesPago', Number(e.target.value))}
          >
            <option value="">-- Seleccionar mes --</option>
            {meses.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Total</CFormLabel>
          <CFormInput
            type="text"
            value={formatearMoneda(totalCalculado)}
            disabled
            readOnly
          />
        </div>

        <div className="mb-3">
          <CFormLabel>Observación</CFormLabel>
          <CFormTextarea
            rows={3}
            disabled={soloLectura}
            value={formData.observacion}
            placeholder="Observaciones adicionales..."
            onChange={(e) => handleChange('observacion', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <CFormLabel>Tipo de Pago</CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.tipoPago}
            onChange={(e) => handleChange('tipoPago', e.target.value)}
          >
            <option value="CREDITO">Crédito</option>
            <option value="DEBITO">Débito</option>
          </CFormSelect>
        </div>

        <ReciboDetallesTable
          detalles={detalles}
          items={items}
          soloLectura={soloLectura}
          formatearMoneda={formatearMoneda}
          onAgregar={abrirNuevoDetalle}
          onEditar={abrirEditarDetalle}
          onEliminar={(index) => setConfirmandoDetalle(index)}
        />
      </CCardBody>
      <CCardFooter className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onClose}>Cancelar</CButton>
        {!soloLectura && <CButton color="primary" onClick={guardar}>Guardar</CButton>}
      </CCardFooter>

      <DetalleModal
        visible={detalleModalVisible}
        detalleEditando={detalleEditando}
        items={items}
        detalleIndex={detalleIndex}
        onChange={handleDetalleChange}
        onConfirmar={confirmarDetalle}
        onCerrar={() => setDetalleModalVisible(false)}
      />

      <ConfirmModal
        visible={confirmandoDetalle !== null}
        onClose={() => setConfirmandoDetalle(null)}
        onConfirm={eliminarDetalle}
        titulo="Confirmar"
        mensaje={<p>¿Eliminar este detalle?</p>}
        textoBotonConfirmar="Eliminar"
      />
    </CCard>
  )
}

export default ReciboForm
