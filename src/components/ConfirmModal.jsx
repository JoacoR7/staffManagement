import React from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const ConfirmModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  titulo = 'Confirmar Acción', 
  mensaje, 
  textoBotonConfirmar = 'Eliminar' 
}) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{titulo}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {mensaje}
        <p className="text-danger mt-2">
          <small>Esta acción no se puede deshacer.</small>
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="danger" className="text-white" onClick={onConfirm}>
          {textoBotonConfirmar}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmModal