import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import { useApi } from "../../../hooks/useApi";

const PaisModal = ({ visible, setVisible, recargar }) => {
  const [nombre, setNombre] = useState('')
  const { apiFetch } = useApi();

  const guardarPais = () => {
    apiFetch('http://localhost:9000/api/v1/pais', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    })
      .then((response) => response.json())
      .then(() => {
        setNombre('')
        setVisible(false)
        recargar()
      })
      .catch((error) => console.error('Error al guardar país:', error))
  }

  const cerrarModal = () => {
    setNombre('')
    setVisible(false)
  }

  return (
    <CModal visible={visible} onClose={cerrarModal}>
      <CModalHeader>
        <CModalTitle>Agregar País</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CFormInput
          type="text"
          placeholder="Ingrese nombre del país"
          aria-label="default input example"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={cerrarModal}>
          Cancelar
        </CButton>

        <CButton color="primary" onClick={guardarPais}>
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PaisModal