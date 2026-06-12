import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormLabel,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import ConfirmModal from '@/components/ConfirmModal'
import ComandaDetallesTable from './ComandaDetallesTable'
import DetalleComandaModal from './DetalleComandaModal'

const estadosComanda = [
  { value: 'ABIERTA', label: 'Abierta' },
  { value: 'PENDIENTE_DE_ENTREGA', label: 'Pendiente de Entrega' },
  { value: 'ENTREGA_FALLIDA', label: 'Entrega Fallida' },
]

const getArticuloNombre = (detalleSeccionCarta) => {
  if (!detalleSeccionCarta) return ''
  if (detalleSeccionCarta.articulo) {
    return detalleSeccionCarta.articulo.nombre
  }
  if (detalleSeccionCarta.menus && detalleSeccionCarta.menus.length > 0) {
    return detalleSeccionCarta.menus.map((m) => m.nombre).join(', ')
  }
  return ''
}

const ComandaForm = ({
  modo,
  entity,
  onClose,
  onGuardar,
  manejarError,
  itemsCarta,
  clientes,
  formatearMoneda,
}) => {
  const [formData, setFormData] = useState({
    estadoComanda: 'ABIERTA',
    clienteId: '',
  })
  const [detalles, setDetalles] = useState([])
  const [detalleModalVisible, setDetalleModalVisible] = useState(false)
  const [detalleEditando, setDetalleEditando] = useState(null)
  const [detalleIndex, setDetalleIndex] = useState(-1)
  const [confirmandoDetalle, setConfirmandoDetalle] = useState(null)

  const soloLectura = modo === 'ver'
  const totalCalculado = detalles.reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0)

  useEffect(() => {
    if (entity) {
      setFormData({
        estadoComanda: entity.estadoComanda ?? 'ABIERTA',
        clienteId: entity.clienteId || '',
      })
      setDetalles((entity.detalles || []).map((d) => ({
        id: d.id,
        cantidad: d.cantidad,
        estadoDetalleComanda: d.estadoDetalleComanda || 'EN_PROCESO_DE_SOLICITUD',
        itemId: d.detalleSeccionCarta?.id || d.detalleSeccionCartaId || '',
        itemNombre: getArticuloNombre(d.detalleSeccionCarta) || d.articuloNombre || '',
        subtotal: d.subtotal || 0,
      })))
    } else {
      setFormData({
        estadoComanda: 'ABIERTA',
        clienteId: '',
      })
      setDetalles([])
    }
  }, [entity])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const guardar = () => {
    if (!formData.clienteId) {
      manejarError('Debe seleccionar un cliente')
      return
    }

    if (!detalles.length) {
      manejarError('Debe agregar al menos un detalle')
      return
    }

    for (let i = 0; i < detalles.length; i++) {
      const d = detalles[i]
      if (!d.itemId) {
        manejarError(`El detalle #${i + 1} debe tener un plato de la carta seleccionado.`)
        return
      }
      if (d.cantidad === undefined || d.cantidad === null || isNaN(d.cantidad) || Number(d.cantidad) <= 0) {
        manejarError(`La cantidad en el detalle #${i + 1} debe ser mayor a 0 y un número válido.`)
        return
      }
    }

    const payload = {
      clienteId: formData.clienteId,
      estadoComanda: formData.estadoComanda,
      detalles: detalles.map((d) => {
        const itemDetalle = {
          cantidad: Number(d.cantidad),
          estadoDetalleComanda: d.estadoDetalleComanda || 'EN_PROCESO_DE_SOLICITUD',
          itemId: d.itemId,
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
    setDetalleEditando({ itemId: '', cantidad: 1, estadoDetalleComanda: 'EN_PROCESO_DE_SOLICITUD' })
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
      manejarError('Debe seleccionar un ítem de la carta')
      return
    }
    if (
      detalleEditando.cantidad === undefined ||
      detalleEditando.cantidad === null ||
      isNaN(detalleEditando.cantidad) ||
      Number(detalleEditando.cantidad) <= 0
    ) {
      manejarError('La cantidad debe ser mayor a 0')
      return
    }

    const cartaItem = itemsCarta.find((i) => i.value === detalleEditando.itemId)
    const itemNombre = cartaItem?.nombre || ''
    
    // Si es edición y ya tenía un subtotal, lo conservamos. Si no, podemos poner 0 (el back calculará el subtotal real en base al precio actual del plato)
    const subtotal = detalleEditando.subtotal || 0

    const detallePayload = {
      ...detalleEditando,
      itemNombre,
      subtotal,
    }

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
          {modo === 'crear' ? 'Nueva Comanda' : modo === 'editar' ? 'Modificar Comanda' : 'Detalle de Comanda'}
        </strong>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <CFormLabel>Cliente <span className="text-danger">*</span></CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.clienteId}
            onChange={(e) => handleChange('clienteId', e.target.value)}
          >
            <option value="">-- Seleccionar cliente --</option>
            {clientes.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Estado Comanda <span className="text-danger">*</span></CFormLabel>
          <CFormSelect
            disabled={soloLectura || modo === 'crear'}
            value={formData.estadoComanda}
            onChange={(e) => handleChange('estadoComanda', e.target.value)}
          >
            {estadosComanda.map((est) => (
              <option key={est.value} value={est.value}>
                {est.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        {modo !== 'crear' && (
          <div className="mb-3">
            <CFormLabel>Total Estimado</CFormLabel>
            <CFormInput
              type="text"
              value={formatearMoneda(totalCalculado)}
              disabled
              readOnly
            />
          </div>
        )}

        <ComandaDetallesTable
          detalles={detalles}
          itemsCarta={itemsCarta}
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

      <DetalleComandaModal
        visible={detalleModalVisible}
        detalleEditando={detalleEditando}
        itemsCarta={itemsCarta}
        detalleIndex={detalleIndex}
        onChange={handleDetalleChange}
        onConfirmar={confirmarDetalle}
        onCerrar={() => setDetalleModalVisible(false)}
      />

      <ConfirmModal
        visible={confirmandoDetalle !== null}
        onClose={() => setConfirmandoDetalle(null)}
        onConfirm={eliminarDetalle}
        titulo="Confirmar Eliminación"
        mensaje={<p>¿Eliminar este plato de la comanda?</p>}
        textoBotonConfirmar="Eliminar"
      />
    </CCard>
  )
}

export default ComandaForm
