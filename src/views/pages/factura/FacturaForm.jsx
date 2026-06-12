import React, { useEffect, useState } from 'react'
import { API_URL } from '@/config'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'

const ESTADOS = [
  { value: 'PAGADA', label: 'Pagada' },
  { value: 'ANULADA', label: 'Anulada' },
  { value: 'SIN_DEFINIR', label: 'Sin Definir' },
]

const formatearMoneda = (valor) => {
  if (valor == null) return '-'
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const inicializarDesdeEntity = (entity) => {
  if (!entity) return null
  return {
    numeroFactura: entity.numeroFactura ?? '',
    fechaFactura: entity.fechaFactura ? entity.fechaFactura.slice(0, 10) : '',
    totalPagado: entity.totalPagado ?? 0,
    estado: entity.estado ?? 'PAGADA',
    formaPagoId: entity.formaPagoId ?? '',
    promocionId: entity.promocionId ?? '',
  }
}

const FacturaForm = ({ modo, entity, onClose }) => {
  const soloLectura = modo === 'ver'

  const [formasPago, setFormasPago] = useState([])
  const [promociones, setPromociones] = useState([])

  const [formData, setFormData] = useState(
    () =>
      inicializarDesdeEntity(entity) || {
        numeroFactura: '',
        fechaFactura: '',
        totalPagado: 0,
        estado: 'PAGADA',
        formaPagoId: '',
        promocionId: '',
      },
  )

  const cargarReferencias = async () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    try {
      const [resFormasPago, resPromociones] = await Promise.all([
        fetch(`${API_URL}/api/v1/formaDePago`, { headers }),
        fetch(`${API_URL}/api/v1/promocion`, { headers }),
      ])

      if (resFormasPago.ok) {
        const data = await resFormasPago.json()
        const lista = Array.isArray(data) ? data : data.content || []
        setFormasPago(lista)
      }

      if (resPromociones.ok) {
        const data = await resPromociones.json()
        const lista = Array.isArray(data) ? data : data.content || []
        setPromociones(lista)
      }
    } catch (err) {
      console.error('Error cargando referencias:', err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarReferencias()
  }, [])

  useEffect(() => {
    const init = inicializarDesdeEntity(entity)
    if (init) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(init)
    }
  }, [entity])

  const formasPagoOptions = formasPago.map((fp) => ({
    value: fp.id,
    label: fp.metodoPago || fp.id.slice(0, 8),
  }))

  const promocionesOptions = promociones.map((p) => ({
    value: p.id,
    label: `${p.descripcion || ''} (${p.porcentajeDescuento || 0}%)`,
  }))

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderDetallesProductos = () => {
    if (!entity || !entity.detalles || entity.detalles.length === 0) return null

    let totalGeneral = 0

    return (
      <div className="mb-3">
        <CFormLabel>Productos Facturados</CFormLabel>
        {entity.detalles.map((df) => {
          const comandaLabel = (df.comandaId || '').slice(0, 8).toUpperCase()
          totalGeneral += df.subtotal || 0

          return (
            <div key={df.id} className="mb-3 p-3 border rounded">
              <strong className="d-block mb-2">{comandaLabel}</strong>
              <div className="table-responsive">
                <table className="table table-sm table-bordered mb-0">
                  <thead
                    style={{
                      backgroundColor: 'var(--cui-tertiary-bg)',
                      color: 'var(--cui-emphasis-color)',
                      borderBottom: '2px solid var(--cui-border-color)',
                    }}
                  >
                    <tr>
                      <th>Artículo</th>
                      <th className="text-center" style={{ width: 70 }}>
                        Cant.
                      </th>
                      <th className="text-end" style={{ width: 130 }}>
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {df.detallesComanda && df.detallesComanda.length > 0 ? (
                      df.detallesComanda.map((dc) => (
                        <tr key={dc.id}>
                          <td>{dc.articuloNombre || '-'}</td>
                          <td className="text-center">{dc.cantidad}</td>
                          <td className="text-end">{formatearMoneda(dc.subtotal)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-muted text-center">
                          Sin productos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
        <div className="text-end fw-bold fs-5">Total: {formatearMoneda(totalGeneral)}</div>
      </div>
    )
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>Detalle de Factura</strong>
      </CCardHeader>

      <CCardBody>
        <div className="mb-3">
          <CFormLabel>
            N° Factura <span className="text-danger">*</span>
          </CFormLabel>
          <CFormInput
            type="number"
            disabled={soloLectura}
            value={formData.numeroFactura}
            onChange={(e) => handleChange('numeroFactura', e.target.value)}
            placeholder="Ej: 1001"
          />
        </div>

        <div className="mb-3">
          <CFormLabel>
            Fecha <span className="text-danger">*</span>
          </CFormLabel>
          <CFormInput
            type="date"
            disabled={soloLectura}
            value={formData.fechaFactura}
            onChange={(e) => handleChange('fechaFactura', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <CFormLabel>
            Estado <span className="text-danger">*</span>
          </CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            {ESTADOS.map((est) => (
              <option key={est.value} value={est.value}>
                {est.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>
            Forma de Pago <span className="text-danger">*</span>
          </CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.formaPagoId}
            onChange={(e) => handleChange('formaPagoId', e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {formasPagoOptions.map((fp) => (
              <option key={fp.value} value={fp.value}>
                {fp.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Promoción</CFormLabel>
          <CFormSelect
            disabled={soloLectura}
            value={formData.promocionId}
            onChange={(e) => handleChange('promocionId', e.target.value)}
          >
            <option value="">-- Sin promoción --</option>
            {promocionesOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </CFormSelect>
        </div>

        <div className="mb-3">
          <CFormLabel>Total Pagado</CFormLabel>
          <CFormInput type="text" disabled value={formatearMoneda(formData.totalPagado)} />
        </div>

        {entity && entity.detalles && entity.detalles.length > 0 && renderDetallesProductos()}
      </CCardBody>

      <CCardFooter className="d-flex justify-content-end">
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CCardFooter>
    </CCard>
  )
}

export default FacturaForm
