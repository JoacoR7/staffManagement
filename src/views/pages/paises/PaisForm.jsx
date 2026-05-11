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

const PaisForm = ({ modo, pais, onClose, onGuardar }) => {
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    setNombre(pais?.nombre || '')
  }, [pais])

  const titulos = {
    crear: 'Nuevo País',
    editar: 'Modificar País',
    ver: 'Detalle del País',
  }

  const soloLectura = modo === 'ver'

  return (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>{titulos[modo]}</strong>
      </CCardHeader>

      <CCardBody>
        <div className="mb-3">
          <CFormLabel>Nombre del País</CFormLabel>
          <CFormInput
            type="text"
            placeholder="Ej: Argentina"
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
          <CButton color="primary" onClick={() => onGuardar({ nombre })}>
            Guardar
          </CButton>
        )}
      </CCardFooter>
    </CCard>
  )
}

export default PaisForm