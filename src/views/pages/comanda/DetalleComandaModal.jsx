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
import Select from 'react-select'

const estadosDetalle = [
  { value: 'EN_PROCESO_DE_SOLICITUD', label: 'En Proceso de Solicitud' },
  { value: 'ENVIADO_A_LA_COCINA', label: 'Enviado a la Cocina' },
  { value: 'COCINERO_ASIGNADO', label: 'Cocinero Asignado' },
  { value: 'ENTREGADO_PARA_DESPACHAR', label: 'Listo para Despachar' },
  { value: 'ENTREGADO_AL_CLIENTE', label: 'Entregado al Cliente' },
  { value: 'PLAZO_EXCEDIDO_DE_ENTREGA', label: 'Plazo Excedido de Entrega' },
]

const DetalleComandaModal = ({
  visible,
  detalleEditando,
  itemsCarta = [],
  detalleIndex,
  onChange,
  onConfirmar,
  onCerrar,
}) => {
  return (
    <CModal visible={visible} onClose={onCerrar}>
      <CModalHeader>
        <CModalTitle>{detalleIndex === -1 ? 'Agregar Plato' : 'Editar Detalle'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Plato / Artículo / Promoción <span className="text-danger">*</span></CFormLabel>
          <Select
            options={itemsCarta}
            value={itemsCarta.find(i => i.value === (detalleEditando?.itemId || '')) || null}
            onChange={(selected) => {
              onChange('itemId', selected?.value || '')
              onChange('detalleSeccionCartaId', selected?.detalleSeccionCartaId || '')
              }}
            placeholder="-- Seleccionar plato --"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: 'var(--cui-body-bg)',
                borderColor: 'var(--cui-border-color)',
                color: 'var(--cui-body-color)',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: 'var(--cui-body-bg)',
                color: 'var(--cui-body-color)',
              }),
              singleValue: (base) => ({
                ...base,
                color: 'var(--cui-body-color)',
              }),
              input: (base) => ({
                ...base,
                color: 'var(--cui-body-color)',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? 'var(--cui-tertiary-bg)'
                  : 'var(--cui-body-bg)',
                color: 'var(--cui-body-color)',
                cursor: 'pointer',
              }),
            }}
          />
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

        {detalleIndex !== -1 && (
          <div className="mb-3">
            <CFormLabel>Estado Preparación</CFormLabel>
            <CFormSelect
              value={detalleEditando?.estadoDetalleComanda || 'EN_PROCESO_DE_SOLICITUD'}
              onChange={(e) => onChange('estadoDetalleComanda', e.target.value)}
            >
              {estadosDetalle.map((ed) => (
                <option key={ed.value} value={ed.value}>
                  {ed.label}
                </option>
              ))}
            </CFormSelect>
          </div>
        )}
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

export default DetalleComandaModal
