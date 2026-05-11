import React from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const ErrorModal = ({ visible, mensaje, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader className="bg-danger text-white">
        <CModalTitle>Error</CModalTitle>
      </CModalHeader>
      <CModalBody className="py-4">
        <p className="mb-0 fs-5">{mensaje}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ErrorModal