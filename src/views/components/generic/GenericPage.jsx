import React, { useEffect, useState } from 'react'
import GenericTable from './GenericTable'
import GenericForm from './GenericForm'
import ErrorModal from '@/components/ErrorModal'
import ConfirmModal from '@/components/ConfirmModal'
import { useApi } from '@/hooks/useApi'

/**
 * GenericPage
 *
 * Página CRUD genérica con tabla paginada + formulario modal.
 * Cubre los modos: crear, editar y ver.
 *
 * Props:
 * - apiBase          {string}    URL base del recurso. Ej: 'http://localhost:9000/api/v1/pais'
 *                                Se asume que:
 *                                  GET    {apiBase}/paged?page=N&size=M  → paginado
 *                                  POST   {apiBase}                       → crear
 *                                  PUT    {apiBase}/{id}                  → editar
 *                                  DELETE {apiBase}/{id}                  → borrar
 *
 * - tituloLista      {string}    Encabezado de la tabla. Ej: "Lista de Países"
 *
 * - titulos          {Object}    Títulos del formulario por modo.
 *                                Ej: { crear: 'Nuevo País', editar: 'Modificar País', ver: 'Detalle del País' }
 *
 * - columns          {Array}     Columnas de la tabla.
 *                                Ej: [{ key: 'nombre', label: 'Nombre' }]
 *                                Cada columna puede tener render(value, item) para celdas personalizadas.
 *
 * - fields           {Array}     Campos del formulario.
 *                                Ej: [{ key: 'nombre', label: 'Nombre del País', placeholder: 'Ej: Argentina' }]
 *                                Ver GenericForm.jsx para la estructura completa.
 *
 * - deleteMessage    {Function}  Función que recibe el item y devuelve el JSX/string del mensaje de confirmación.
 *                                Ej: (item) => <p>¿Eliminar <strong>{item.nombre}</strong>?</p>
 *
 * - deleteButtonText {string}    Texto del botón de confirmación de borrado. Ej: "Eliminar País"
 *
 * - tamanioPagina    {number}    Cantidad de ítems por página. Default: 20.
 */
const GenericPage = ({
  apiBase,
  tituloLista,
  titulos,
  columns,
  fields,
  deleteMessage,
  deleteButtonText = 'Eliminar',
  tamanioPagina = 20,
}) => {
  const { apiFetch } = useApi()

  const [items, setItems] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modo, setModo] = useState('crear')
  const [seleccionado, setSeleccionado] = useState(null)

  const [visibleEliminar, setVisibleEliminar] = useState(false)
  const [paraEliminar, setParaEliminar] = useState(null)

  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState('')

  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)

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
      const response = await apiFetch(`${apiBase}/paged?page=${page}&size=${tamanioPagina}`)
      const data = await response.json()
      if (!response.ok) {
        manejarError(data.error)
        return
      }
      setItems(data.content || [])
      setTotalPaginas(data.totalPages || 1)
    } catch (error) {
      manejarError(error.message)
    }
  }

  // ── Navegación ──────────────────────────────────────────────────────────────

  const abrirCrear = () => {
    setModo('crear')
    setSeleccionado(null)
    setMostrarFormulario(true)
  }

  const abrirEditar = (item) => {
    setModo('editar')
    setSeleccionado(item)
    setMostrarFormulario(true)
  }

  const abrirVer = (item) => {
    setModo('ver')
    setSeleccionado(item)
    setMostrarFormulario(true)
  }

  const volverALista = () => {
    setMostrarFormulario(false)
    setSeleccionado(null)
  }

  // ── Borrar ───────────────────────────────────────────────────────────────────

  const abrirConfirmacionBorrar = (item) => {
    setParaEliminar(item)
    setVisibleEliminar(true)
  }

  const ejecutarBorrar = async () => {
    if (!paraEliminar) return
    try {
      const response = await apiFetch(`${apiBase}/${paraEliminar.id}`, { method: 'DELETE' })
      if (response.ok) {
        cargarDatos(paginaActual)
      } else {
        const errorData = await response.json()
        manejarError(errorData.error)
      }
    } catch (error) {
      manejarError('Hubo un problema eliminando el objeto')
    } finally {
      setVisibleEliminar(false)
      setParaEliminar(null)
    }
  }

  // ── Guardar ──────────────────────────────────────────────────────────────────

  const guardar = async (payload) => {
    try {
      const url = modo === 'crear' ? apiBase : `${apiBase}/${seleccionado.id}`
      const metodo = modo === 'crear' ? 'POST' : 'PUT'
      await apiFetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      volverALista()
      cargarDatos(paginaActual)
    } catch (error) {
      manejarError(error.message)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid">
      {!mostrarFormulario ? (
        <GenericTable
          titulo={tituloLista}
          items={items}
          columns={columns}
          onAgregar={abrirCrear}
          onEditar={abrirEditar}
          onConsultar={abrirVer}
          onBorrar={abrirConfirmacionBorrar}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      ) : (
        <GenericForm
          modo={modo}
          entity={seleccionado}
          onClose={volverALista}
          onGuardar={guardar}
          titulos={titulos}
          fields={fields}
        />
      )}

      <ConfirmModal
        visible={visibleEliminar}
        onClose={() => setVisibleEliminar(false)}
        onConfirm={ejecutarBorrar}
        titulo="Confirmar Eliminación"
        mensaje={deleteMessage ? deleteMessage(paraEliminar) : <p>¿Confirmar eliminación?</p>}
        textoBotonConfirmar={deleteButtonText}
      />

      <ErrorModal
        visible={errorVisible}
        mensaje={errorMensaje}
        onClose={() => setErrorVisible(false)}
      />
    </div>
  )
}

export default GenericPage
