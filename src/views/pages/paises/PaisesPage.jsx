import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import PaisTable from './PaisTable'
import PaisForm from './PaisForm'
import ErrorModal from '@/components/ErrorModal'
import ConfirmModal from '@/components/ConfirmModal'
import { useApi } from '@/hooks/useApi'

const PaisesPage = () => {
  const { apiFetch } = useApi()
  const [paises, setPaises] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modo, setModo] = useState('crear') // 'crear', 'editar', 'ver'
  const [paisSeleccionado, setPaisSeleccionado] = useState(null)

  const [visibleEliminar, setVisibleEliminar] = useState(false)
  const [paisParaEliminar, setPaisParaEliminar] = useState(null)

  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState('')

  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanioPagina] = useState(20)

  useEffect(() => {
    cargarPaises(paginaActual)
  }, [paginaActual])

  const manejarError = (mensaje) => {
    const textoFinal = typeof mensaje === 'string' ? mensaje : 'Error inesperado del servidor'
    setErrorMensaje(textoFinal)
    setErrorVisible(true)
  }

  const cargarPaises = async (page) => {
    try {
      const response = await apiFetch(`http://localhost:9000/api/v1/pais/paged?page=${page}&size=${tamanioPagina}`)
      const data = await response.json()
      
      if (!response.ok) {
        manejarError(data.error)
        return
      }

      setPaises(data.content || [])
      setTotalPaginas(data.totalPages || 1)
    } catch (error) {
      manejarError(error.message)
    }
  }


  const abrirCrear = () => {
    setModo('crear')
    setPaisSeleccionado(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (pais) => {
    setModo('editar')
    setPaisSeleccionado(pais)
    setMostrarFormulario(true)
  }

  const abrirVer = (pais) => {
    setModo('ver')
    setPaisSeleccionado(pais)
    setMostrarFormulario(true)
  }

  const volverALista = () => {
    setMostrarFormulario(false)
    setPaisSeleccionado(null)
  }

  const abrirConfirmacionBorrar = (pais) => {
    setPaisParaEliminar(pais)
    setVisibleEliminar(true)
  }

  const ejecutarBorrar = async () => {
    if (!paisParaEliminar) return

    try {
      const response = await apiFetch(`http://localhost:9000/api/v1/pais/${paisParaEliminar.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        cargarPaises(paginaActual)
      } else {
        const errorData = await response.json()
        manejarError(errorData.error)
      }
    } catch (error) {
      manejarError("Hubo un problema eliminando el objeto")
    } finally {
      setVisibleEliminar(false)
      setPaisParaEliminar(null)
    }
  }

  const guardarPais = async (payload) => {
      try {
        const url = modo === 'crear' 
          ? 'http://localhost:9000/api/v1/pais' 
          : `http://localhost:9000/api/v1/pais/${paisSeleccionado.id}`
        
        const metodo = modo === 'crear' ? 'POST' : 'PUT'

        const response = await apiFetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
        volverALista()
        cargarPaises(paginaActual)

      } catch (error) {
        console.error("Error capturado:", error.message)
        manejarError(error.message) 
      }
    }

return (
    <div className="container-fluid">
      {!mostrarFormulario ? (
        <PaisTable
          paises={paises}
          onAgregar={abrirCrear}
          onEditar={abrirEditar}
          onConsultar={abrirVer}
          onBorrar={abrirConfirmacionBorrar} 
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      ) : (
        <PaisForm
          modo={modo}
          pais={paisSeleccionado}
          onClose={volverALista}
          onGuardar={guardarPais}
        />
      )}

      <ConfirmModal
        visible={visibleEliminar}
        onClose={() => setVisibleEliminar(false)}
        onConfirm={ejecutarBorrar}
        titulo="Confirmar Eliminación"
        mensaje={
          <p>
            ¿Estás seguro de que deseas eliminar el país <strong>{paisParaEliminar?.nombre}</strong>?
          </p>
        }
        textoBotonConfirmar="Eliminar País"
      />

      <ErrorModal 
        visible={errorVisible} 
        mensaje={errorMensaje} 
        onClose={() => setErrorVisible(false)} 
      />
    </div>
  )
}

export default PaisesPage