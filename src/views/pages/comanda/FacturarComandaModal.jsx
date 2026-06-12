import React, { useState, useEffect } from 'react'
import {
  CButton,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useApi } from '@/hooks/useApi'

const FacturarComandaModal = ({
  visible,
  comanda,
  promociones = [],
  onCerrar,
  onConfirmar,
}) => {
  const { apiFetch } = useApi()
  const [formasPago, setFormasPago] = useState([])
  const [formaPagoId, setFormaPagoId] = useState('')
  const [promocionId, setPromocionId] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (visible) {
      cargarFormasPago()
      setFormaPagoId('')
      setPromocionId('')
    }
  }, [visible])

  const cargarFormasPago = async () => {
    try {
      const res = await apiFetch('http://localhost:9000/api/v1/formaDePago')
      if (res && res.ok) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.content || []
        if (list.length > 0) {
          setFormasPago(list.map(f => ({ value: f.id, label: f.metodoPago || f.id })))
          return
        }
      }
      throw new Error('No api forms')
    } catch {
      // Fallback a formas de pago estáticas si falla la API
      setFormasPago([
        { value: 'EFECTIVO', label: 'Efectivo' },
        { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
        { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
        { value: 'MERCADO_PAGO', label: 'Mercado Pago' }
      ])
    }
  }

  const manejarConfirmar = async () => {
    if (!formaPagoId) {
      alert('Debe seleccionar una forma de pago')
      return
    }
    setCargando(true)
    try {
      await onConfirmar(formaPagoId, promocionId)
    } finally {
      setCargando(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onCerrar}>
      <CModalHeader>
        <CModalTitle>Facturar Comanda</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Está por facturar la comanda: <strong>{comanda?.id?.slice(0, 8).toUpperCase()}</strong>
        </p>
        <p>
          Monto total estimado: <strong>$ {comanda?.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
        </p>

        <div className="mb-3">
          <CFormLabel>Forma de Pago <span className="text-danger">*</span></CFormLabel>
          <CFormSelect
            value={formaPagoId}
            onChange={(e) => setFormaPagoId(e.target.value)}
            disabled={cargando}
          >
            <option value="">-- Seleccionar forma de pago --</option>
            {formasPago.map((fp) => (
              <option key={fp.value} value={fp.value}>
                {fp.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Promoción Aplicada (Opcional)</CFormLabel>
          <CFormSelect
            value={promocionId}
            onChange={(e) => setPromocionId(e.target.value)}
            disabled={cargando}
          >
            <option value="">-- Sin promoción --</option>
            {promociones.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </CFormSelect>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCerrar} disabled={cargando}>
          Cancelar
        </CButton>
        <CButton color="success" onClick={manejarConfirmar} disabled={cargando}>
          {cargando ? 'Procesando...' : 'Confirmar Facturación'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default FacturarComandaModal
