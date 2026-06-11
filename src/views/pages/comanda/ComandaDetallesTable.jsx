import React from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus, cilPencil } from '@coreui/icons'

const mapeoEstadoDetalle = {
  EN_PROCESO_DE_SOLICITUD: { color: 'secondary', label: 'En Proceso de Solicitud' },
  ENVIADO_A_LA_COCINA: { color: 'warning', label: 'Enviado a Cocina' },
  COCINERO_ASIGNADO: { color: 'info', label: 'Cocinero Asignado' },
  ENTREGADO_PARA_DESPACHAR: { color: 'primary', label: 'Listo para Despachar' },
  ENTREGADO_AL_CLIENTE: { color: 'success', label: 'Entregado al Cliente' },
  PLAZO_EXCEDIDO_DE_ENTREGA: { color: 'danger', label: 'Plazo Excedido' },
}

const renderEstadoDetalle = (val) => {
  const config = mapeoEstadoDetalle[val] || { color: 'dark', label: val }
  return <CBadge color={config.color}>{config.label}</CBadge>
}

const ComandaDetallesTable = ({
  detalles,
  itemsCarta,
  soloLectura,
  formatearMoneda,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  return (
    <>
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Platos / Ítems de la Comanda</h5>
        {!soloLectura && (
          <CButton color="success" size="sm" onClick={onAgregar}>
            <CIcon icon={cilPlus} className="me-1" />Agregar Plato
          </CButton>
        )}
      </div>

      <CTable striped hover responsive size="sm">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Plato / Promoción</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '100px' }}>Cantidad</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '150px' }}>Estado Preparación</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '120px' }}>Subtotal</CTableHeaderCell>
            {!soloLectura && (
              <CTableHeaderCell style={{ width: '120px' }} className="text-center">
                Acción
              </CTableHeaderCell>
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {detalles.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={soloLectura ? 4 : 5} className="text-center text-muted">
                Sin platos agregados
              </CTableDataCell>
            </CTableRow>
          ) : (
            detalles.map((d, i) => (
              <CTableRow key={i}>
                <CTableDataCell>
                  {itemsCarta.find((item) => item.value === d.itemId)?.label || d.itemNombre || '---'}
                </CTableDataCell>
                <CTableDataCell>{d.cantidad}</CTableDataCell>
                <CTableDataCell>{renderEstadoDetalle(d.estadoDetalleComanda)}</CTableDataCell>
                <CTableDataCell>{d.subtotal ? formatearMoneda(d.subtotal) : '-'}</CTableDataCell>
                {!soloLectura && (
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-center gap-1">
                      <CButton
                        color="primary"
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditar(i)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        variant="ghost"
                        onClick={() => onEliminar(i)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ComandaDetallesTable
