import React from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus, cilPencil } from '@coreui/icons'

const ReciboDetallesTable = ({
  detalles,
  items,
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
        <h5 className="mb-0">Detalles del Recibo</h5>
        {!soloLectura && (
          <CButton color="success" size="sm" onClick={onAgregar}>
            <CIcon icon={cilPlus} className="me-1" />Agregar detalle
          </CButton>
        )}
      </div>

      <CTable striped hover responsive size="sm">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Item</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '100px' }}>Cantidad</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '120px' }}>Valor</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '120px' }} className="text-center">
              Acción
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {detalles.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center text-muted">
                Sin detalles
              </CTableDataCell>
            </CTableRow>
          ) : (
            detalles.map((d, i) => (
              <CTableRow key={i}>
                <CTableDataCell>
                  {items.find((item) => item.value === d.itemId)?.label || d.itemNombre || '---'}
                </CTableDataCell>
                <CTableDataCell>{d.cantidad}</CTableDataCell>
                <CTableDataCell>{formatearMoneda(d.valor)}</CTableDataCell>
                <CTableDataCell className="text-center">
                  {!soloLectura && (
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
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ReciboDetallesTable
