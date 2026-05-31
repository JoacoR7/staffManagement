import React from 'react'
import {
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const DetalleModal = ({
  visible,
  detalleEditando,
  items,
  detalleIndex,
  onChange,
  onConfirmar,
  onCerrar,
}) => {
  return (
    <CModal visible={visible} onClose={onCerrar}>
      <CModalHeader>
        <CModalTitle>{detalleIndex === -1 ? 'Agregar detalle' : 'Editar detalle'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Item <span className="text-danger">*</span></CFormLabel>
          <CFormSelect
            value={detalleEditando?.itemId || ''}
            onChange={(e) => onChange('itemId', e.target.value)}
          >
            <option value="">-- Seleccionar item --</option>
            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div className="mb-3">
          <CFormLabel>Cantidad <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            type="number"
            min={1}
            value={detalleEditando?.cantidad ?? 1}
            onChange={(e) => onChange('cantidad', Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <CFormLabel>Valor</CFormLabel>
          <CFormInput
            type="number"
            step="0.01"
            value={detalleEditando?.valor ?? 0}
            onChange={(e) => onChange('valor', Number(e.target.value))}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCerrar}>Cancelar</CButton>
        <CButton color="primary" onClick={onConfirmar}>
          {detalleIndex === -1 ? 'Agregar' : 'Guardar'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DetalleModal
