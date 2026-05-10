import React, { useEffect, useState } from 'react'
import PaisTable from './PaisTable'
import PaisModal from './PaisModal'
import { useApi } from "@/hooks/useApi";

const PaisesPage = () => {
  const [paises, setPaises] = useState([])
  const [visible, setVisible] = useState(false)
  const {apiFetch} = useApi();

  useEffect(() => {
    cargarPaises()
  }, [])

  const cargarPaises = async () => {
    try {
      const response = await apiFetch('http://localhost:9000/api/v1/pais')
      const data = await response.json()
      setPaises(data)
    } catch (error) {
      console.error(error)
    }
  }

  const agregarPais = (nuevoPais) => {
    setPaises((prev) => [...prev, nuevoPais])
  }

  return (
    <>
      <PaisTable
        paises={paises}
        onAgregar={() => setVisible(true)}
      />

      <PaisModal
        visible={visible}
        setVisible={setVisible}
        recargar={cargarPaises}
      />
    </>
  )
}

export default PaisesPage