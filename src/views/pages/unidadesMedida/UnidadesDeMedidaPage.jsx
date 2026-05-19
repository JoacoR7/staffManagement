import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import UnidadMedidaTable from './UnidadMedidaTable'
import UnidadMedidaForm from './UnidadMedidaForm'
import ErrorModal from '@/components/ErrorModal'
import ConfirmModal from '@/components/ConfirmModal'
import { useApi } from '@/hooks/useApi'

const UnidadesDeMedidaPage = () => {
  const { apiFetch } = useApi()
  const [entities, setEntities] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modo, setModo] = useState('crear') // 'crear', 'editar', 'ver'
  const [seleccionado, setSeleccionado] = useState(null)

  const [visibleEliminar, setVisibleEliminar] = useState(false)
  const [paraEliminar, setParaEliminar] = useState(null)

  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState('')

  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [tamanioPagina] = useState(20)

  useEffect(() => {
    cargarDatos(paginaActual)
  }, [paginaActual])

  const manejarError = (mensaje) => {
    const textoFinal = typeof mensaje === 'string' ? mensaje : 'Error inesperado del servidor'
    setErrorMensaje(textoFinal)
    setErrorVisible(true)
  }

  const cargarDatos = async (page) => {
    try {
      const response = await apiFetch(`http://localhost:9000/api/v1/unidadDeMedida/paged?page=${page}&size=${tamanioPagina}`)
      const data = await response.json()
      
      if (!response.ok) {
        manejarError(data.error)
        return
      }

      setEntities(data.content || [])
      setTotalPaginas(data.totalPages || 1)
    } catch (error) {
      manejarError(error.message)
    }
  }


  const abrirCrear = () => {
    setModo('crear')
    setSeleccionado(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (entity) => {
    setModo('editar')
    setSeleccionado(entity)
    setMostrarFormulario(true)
  }

  const abrirVer = (entity) => {
    setModo('ver')
    setSeleccionado(entity)
    setMostrarFormulario(true)
  }

  const volverALista = () => {
    setMostrarFormulario(false)
    setSeleccionado(null)
  }

  const abrirConfirmacionBorrar = (entity) => {
    setParaEliminar(entity)
    setVisibleEliminar(true)
  }

  const ejecutarBorrar = async () => {
    if (!paraEliminar) return

    try {
      const response = await apiFetch(`http://localhost:9000/api/v1/unidadDeMedida/${paraEliminar.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        cargarDatos(paginaActual)
      } else {
        const errorData = await response.json()
        manejarError(errorData.error)
      }
    } catch (error) {
      manejarError("Hubo un problema eliminando el objeto")
    } finally {
      setVisibleEliminar(false)
      setParaEliminar(null)
    }
  }

  const guardarUnidadDeMedida = async (payload) => {
      try {
        const url = modo === 'crear' 
          ? 'http://localhost:9000/api/v1/unidadDeMedida' 
          : `http://localhost:9000/api/v1/unidadDeMedida/${seleccionado.id}`
        
        const metodo = modo === 'crear' ? 'POST' : 'PUT'

        const response = await apiFetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
        volverALista()
        cargarDatos(paginaActual)

      } catch (error) {
        console.error("Error capturado:", error.message)
        manejarError(error.message) 
      }
    }

return (
    <div className="container-fluid">
      {!mostrarFormulario ? (
        <UnidadMedidaTable
          unidadesDeMedida={entities}
          onAgregar={abrirCrear}
          onEditar={abrirEditar}
          onConsultar={abrirVer}
          onBorrar={abrirConfirmacionBorrar} 
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      ) : (
        <UnidadMedidaForm
          modo={modo}
          unidadDeMedida={seleccionado}
          onClose={volverALista}
          onGuardar={guardarUnidadDeMedida}
        />
      )}

      <ConfirmModal
        visible={visibleEliminar}
        onClose={() => setVisibleEliminar(false)}
        onConfirm={ejecutarBorrar}
        titulo="Confirmar Eliminación"
        mensaje={
          <p>
            ¿Estás seguro de que deseas eliminar la unidad de medida <strong>{paraEliminar?.nombre}</strong>?
          </p>
        }
        textoBotonConfirmar="Eliminar Unidad de Medida"
      />

      <ErrorModal 
        visible={errorVisible} 
        mensaje={errorMensaje} 
        onClose={() => setErrorVisible(false)} 
      />
    </div>
  )
}

export default UnidadesDeMedidaPage