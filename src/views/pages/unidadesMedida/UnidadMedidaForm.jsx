import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const UnidadDeMedidaForm = ({ modo, unidadDeMedida, onClose, onGuardar }) => {
  const [id, setId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [eliminado, setEliminado] = useState(false)

  useEffect(() => {
    setId(unidadDeMedida?.id || null)
    setNombre(unidadDeMedida?.nombre || '')
    setEliminado(unidadDeMedida?.eliminado || false)
  }, [unidadDeMedida])

  const titulos = {
    crear: 'Nueva Unidad de Medida',
    editar: 'Modificar Unidad de Medida',
    ver: 'Detalle de la Unidad de Medida',
  }

  const soloLectura = modo === 'ver'

  return (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>{titulos[modo]}</strong>
      </CCardHeader>

      <CCardBody>
        <div className="mb-3">
          <CFormLabel>Nombre de la Unidad de Medida</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Ej: Kilogramo"
            value={nombre}
            disabled={soloLectura}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>

        {!soloLectura && (
          <CButton color="primary" onClick={() => onGuardar({ id, nombre, eliminado })}>
            Guardar
          </CButton>
        )}
      </CCardFooter>
    </CCard>
  )
}

export default UnidadDeMedidaForm