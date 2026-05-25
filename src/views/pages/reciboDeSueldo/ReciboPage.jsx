import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilTrash, cilPencil, cilSearch, cilPlus } from '@coreui/icons'
import { useApi } from '@/hooks/useApi'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  try {
    const [anio, mes, dia] = fecha.slice(0, 10).split('-')
    return `${dia}/${mes}/${anio}`
  } catch {
    return fecha
  }
}

const formatearMoneda = (valor) => {
  if (valor == null) return '-'
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const API_BASE = 'http://localhost:9000/api/v1/reciboDeSueldo'
const API_EMPLEADOS = 'http://localhost:9000/api/v1/empleado'
const API_ITEMS = 'http://localhost:9000/api/v1/itemReciboDeSueldo'
const TAMANIO_PAGINA = 10

const ReciboPage = () => {
  const { apiFetch } = useApi()

  const [empleados, setEmpleados] = useState([])
  const [items, setItems] = useState([])
  const [cargandoOpciones, setCargandoOpciones] = useState(true)

  const [recibos, setRecibos] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modo, setModo] = useState('crear')
  const [seleccionado, setSeleccionado] = useState(null)
  const [formData, setFormData] = useState(initialFormData())
  const [detalles, setDetalles] = useState([])

  const [detalleModalVisible, setDetalleModalVisible] = useState(false)
  const [detalleEditando, setDetalleEditando] = useState(null)
  const [detalleIndex, setDetalleIndex] = useState(-1)

  const [errorMensaje, setErrorMensaje] = useState('')
  const [errorVisible, setErrorVisible] = useState(false)

  const [eliminarVisible, setEliminarVisible] = useState(false)
  const [paraEliminar, setParaEliminar] = useState(null)
  const [confirmandoDetalle, setConfirmandoDetalle] = useState(null)

  useEffect(() => {
    Promise.all([cargarEmpleados(), cargarItems()]).finally(() => setCargandoOpciones(false))
  }, [])

  useEffect(() => {
    cargarRecibos(paginaActual)
  }, [paginaActual])

  function initialFormData() {
    return { fechaDePago: '', mesPago: '', totalPago: '', observacion: '', empleadoId: '', tipoPago: 'CREDITO' }
  }

  const manejarError = (mensaje) => {
    setErrorMensaje(typeof mensaje === 'string' ? mensaje : 'Error inesperado')
    setErrorVisible(true)
  }

  const cargarEmpleados = async () => {
    try {
      const res = await apiFetch(API_EMPLEADOS)
      if (!res) return
      const data = await res.json()
      const lista = Array.isArray(data) ? data : []
      setEmpleados(lista.map((e) => ({ value: e.id, label: `${e.nombre} ${e.apellido}` })))
    } catch { }
  }

  const cargarItems = async () => {
    try {
      const res = await apiFetch(API_ITEMS)
      if (!res) return
      const data = await res.json()
      const lista = Array.isArray(data) ? data : []
      setItems(lista.map((i) => ({ value: i.id, label: i.nombre })))
    } catch { }
  }

  const cargarRecibos = async (page) => {
    try {
      const res = await apiFetch(`${API_BASE}/paged?page=${page}&size=${TAMANIO_PAGINA}`)
      if (!res) return
      const data = await res.json()
      setRecibos(data.content || [])
      setTotalPaginas(data.totalPages || 1)
    } catch (err) {
      manejarError(err.message)
    }
  }

  const abrirCrear = () => {
    setModo('crear')
    setSeleccionado(null)
    setFormData(initialFormData())
    setDetalles([])
    setMostrarFormulario(true)
  }

  const abrirEditar = async (item) => {
    try {
      const res = await apiFetch(`${API_BASE}/${item.id}`)
      if (!res) return
      const data = await res.json()
      setModo('editar')
      setSeleccionado(data)
      setFormData({
        fechaDePago: data.fechaDePago ? data.fechaDePago.slice(0, 10) : '',
        mesPago: data.mesPago ?? '',
        totalPago: data.totalPago ?? '',
        observacion: data.observacion ?? '',
        empleadoId: data.empleado?.id ?? '',
        tipoPago: data.detalles?.[0]?.tipoDetalleRecibo || 'CREDITO',
      })
      setDetalles((data.detalles || []).map((d) => ({
        id: d.id,
        cantidad: d.cantidad,
        valor: d.valor,
        tipoDetalleRecibo: d.tipoDetalleRecibo || 'CREDITO',
        itemId: d.itemReciboDeSueldo?.id || '',
        itemNombre: d.itemReciboDeSueldo?.nombre || '',
      })))
      setMostrarFormulario(true)
    } catch (err) {
      manejarError(err.message)
    }
  }

  const abrirVer = (item) => abrirEditar(item).then(() => setModo('ver'))

  const volverALista = () => {
    setMostrarFormulario(false)
    setSeleccionado(null)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const totalCalculado = detalles.reduce((sum, d) => sum + (Number(d.cantidad) || 0) * (Number(d.valor) || 0), 0)

  const guardar = async () => {
    try {
      if (!formData.empleadoId) { manejarError('Debe seleccionar un empleado'); return }
      if (!formData.fechaDePago) { manejarError('Debe indicar la fecha de pago'); return }
      if (!detalles.length) { manejarError('Debe agregar al menos un detalle'); return }

      const payload = {
        fechaDePago: formData.fechaDePago,
        mesPago: Number(formData.mesPago),
        totalPago: Number(formData.totalPago) || totalCalculado,
        observacion: formData.observacion,
        empleado: { id: formData.empleadoId },
        detalles: detalles.map((d) => ({
          id: d.id || undefined,
          cantidad: Number(d.cantidad),
          valor: Number(d.valor),
          tipoDetalleRecibo: formData.tipoPago,
          itemReciboDeSueldo: { id: d.itemId },
        })),
      }

      const url = modo === 'crear' ? API_BASE : `${API_BASE}/${seleccionado.id}`
      const metodo = modo === 'crear' ? 'POST' : 'PUT'

      const res = await apiFetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res) return
      volverALista()
      cargarRecibos(paginaActual)
    } catch (err) {
      manejarError(err.message)
    }
  }

  const abrirConfirmacionBorrar = (item) => {
    setParaEliminar(item)
    setEliminarVisible(true)
  }

  const ejecutarBorrar = async () => {
    if (!paraEliminar) return
    try {
      await apiFetch(`${API_BASE}/${paraEliminar.id}`, { method: 'DELETE' })
      cargarRecibos(paginaActual)
    } catch (err) {
      manejarError(err.message)
    } finally {
      setEliminarVisible(false)
      setParaEliminar(null)
    }
  }

  const abrirNuevoDetalle = () => {
    setDetalleEditando({ itemId: '', cantidad: 1, valor: 0 })
    setDetalleIndex(-1)
    setDetalleModalVisible(true)
  }

  const abrirEditarDetalle = (index) => {
    setDetalleEditando({ ...detalles[index] })
    setDetalleIndex(index)
    setDetalleModalVisible(true)
  }

  const confirmarDetalle = () => {
    if (!detalleEditando.itemId) { manejarError('Debe seleccionar un item'); return }
    if (!detalleEditando.cantidad || detalleEditando.cantidad < 1) { manejarError('La cantidad debe ser mayor a 0'); return }

    const itemNombre = items.find((i) => i.value === detalleEditando.itemId)?.label || ''

    const detallePayload = { ...detalleEditando, itemNombre, tipoDetalleRecibo: formData.tipoPago }

    if (detalleIndex === -1) {
      setDetalles((prev) => [...prev, detallePayload])
    } else {
      setDetalles((prev) => {
        const copy = [...prev]
        copy[detalleIndex] = detallePayload
        return copy
      })
    }
    setDetalleModalVisible(false)
  }

  const confirmarEliminarDetalle = (index) => {
    setConfirmandoDetalle(index)
  }

  const ejecutarEliminarDetalle = () => {
    if (confirmandoDetalle !== null) {
      setDetalles((prev) => prev.filter((_, i) => i !== confirmandoDetalle))
      setConfirmandoDetalle(null)
    }
  }

  const soloLectura = modo === 'ver'

  const renderTable = () => (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Lista de Recibos de Sueldo</h4>
        <CButton color="primary" onClick={abrirCrear}>Agregar</CButton>
      </CCardHeader>
      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '120px' }} className="text-center">Acciones</CTableHeaderCell>
              <CTableHeaderCell>Fecha de Pago</CTableHeaderCell>
              <CTableHeaderCell>Mes</CTableHeaderCell>
              <CTableHeaderCell>Empleado</CTableHeaderCell>
              <CTableHeaderCell>Total</CTableHeaderCell>
              <CTableHeaderCell>Observación</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {recibos.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center text-muted">No hay recibos registrados</CTableDataCell>
              </CTableRow>
            ) : (
              recibos.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="text-center">
                    <CDropdown>
                      <CDropdownToggle color="primary" variant="outline" size="sm">
                        <CIcon icon={cilOptions} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => abrirVer(item)}>
                          <CIcon icon={cilSearch} className="me-2" />Consultar
                        </CDropdownItem>
                        <CDropdownItem onClick={() => abrirEditar(item)}>
                          <CIcon icon={cilPencil} className="me-2" />Modificar
                        </CDropdownItem>
                        <CDropdownItem className="text-danger" onClick={() => abrirConfirmacionBorrar(item)}>
                          <CIcon icon={cilTrash} className="me-2" />Borrar
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                  <CTableDataCell>{formatearFecha(item.fechaDePago)}</CTableDataCell>
                  <CTableDataCell>{meses[item.mesPago - 1] || item.mesPago}</CTableDataCell>
                  <CTableDataCell>{item.empleado ? `${item.empleado.nombre} ${item.empleado.apellido}` : '-'}</CTableDataCell>
                  <CTableDataCell>{formatearMoneda(item.totalPago)}</CTableDataCell>
                  <CTableDataCell>{item.observacion || '-'}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
        <div className="d-flex justify-content-center mt-3">
          <CPagination align="center">
            <CPaginationItem disabled={paginaActual === 0} onClick={() => setPaginaActual(paginaActual - 1)} style={{ cursor: 'pointer' }}>
              Anterior
            </CPaginationItem>
            {[...Array(totalPaginas)].map((_, i) => (
              <CPaginationItem key={i} active={i === paginaActual} onClick={() => setPaginaActual(i)} style={{ cursor: 'pointer' }}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={paginaActual >= totalPaginas - 1} onClick={() => setPaginaActual(paginaActual + 1)} style={{ cursor: 'pointer' }}>
              Siguiente
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  )

  const renderForm = () => (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>{modo === 'crear' ? 'Nuevo Recibo de Sueldo' : modo === 'editar' ? 'Modificar Recibo de Sueldo' : 'Detalle del Recibo de Sueldo'}</strong>
      </CCardHeader>
      <CCardBody>
        {cargandoOpciones ? (
          <div className="text-center py-4"><CSpinner /></div>
        ) : (
          <>
            <div className="mb-3">
              <CFormLabel>Empleado <span className="text-danger">*</span></CFormLabel>
              <CFormSelect
                disabled={soloLectura}
                value={formData.empleadoId}
                onChange={(e) => handleChange('empleadoId', e.target.value)}
              >
                <option value="">-- Seleccionar empleado --</option>
                {empleados.map((emp) => (
                  <option key={emp.value} value={emp.value}>{emp.label}</option>
                ))}
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel>Fecha de Pago <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="date"
                disabled={soloLectura}
                value={formData.fechaDePago}
                onChange={(e) => handleChange('fechaDePago', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Mes</CFormLabel>
              <CFormInput
                type="number"
                min={1}
                max={12}
                placeholder="Ej: 5"
                disabled={soloLectura}
                value={formData.mesPago}
                onChange={(e) => handleChange('mesPago', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Total</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                placeholder={totalCalculado > 0 ? `Sugerido: ${totalCalculado}` : '0.00'}
                disabled={soloLectura}
                value={formData.totalPago}
                onChange={(e) => handleChange('totalPago', e.target.value)}
              />
              {totalCalculado > 0 && (
                <small className="text-muted">Suma automática de detalles: {formatearMoneda(totalCalculado)}</small>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Observación</CFormLabel>
              <CFormTextarea
                rows={3}
                disabled={soloLectura}
                value={formData.observacion}
                placeholder="Observaciones adicionales..."
                onChange={(e) => handleChange('observacion', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Tipo de Pago</CFormLabel>
              <CFormSelect
                disabled={soloLectura}
                value={formData.tipoPago}
                onChange={(e) => handleChange('tipoPago', e.target.value)}
              >
                <option value="CREDITO">Crédito</option>
                <option value="DEBITO">Débito</option>
              </CFormSelect>
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Detalles del Recibo</h5>
              {!soloLectura && (
                <CButton color="success" size="sm" onClick={abrirNuevoDetalle}>
                  <CIcon icon={cilPlus} className="me-1" />Agregar detalle
                </CButton>
              )}
            </div>

            <CTable striped hover responsive size="sm">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Item</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '100px' }}>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '120px' }}>Valor</CTableHeaderCell>

                  <CTableHeaderCell style={{ width: '80px' }} className="text-center">Acción</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detalles.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={4} className="text-center text-muted">Sin detalles</CTableDataCell>
                  </CTableRow>
                ) : (
                  detalles.map((d, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{d.itemNombre || '---'}</CTableDataCell>
                      <CTableDataCell>{d.cantidad}</CTableDataCell>
                      <CTableDataCell>{formatearMoneda(d.valor)}</CTableDataCell>

                      <CTableDataCell className="text-center">
                        {!soloLectura && (
                          <CButton color="danger" size="sm" variant="ghost" onClick={() => confirmarEliminarDetalle(i)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </>
        )}
      </CCardBody>
      <CCardFooter className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={volverALista}>Cancelar</CButton>
        {!soloLectura && <CButton color="primary" onClick={guardar}>Guardar</CButton>}
      </CCardFooter>
    </CCard>
  )

  return (
    <div className="container-fluid">
      {mostrarFormulario ? renderForm() : renderTable()}

      <CModal visible={detalleModalVisible} onClose={() => setDetalleModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{detalleIndex === -1 ? 'Agregar detalle' : 'Editar detalle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Item <span className="text-danger">*</span></CFormLabel>
            <CFormSelect
              value={detalleEditando?.itemId || ''}
              onChange={(e) => setDetalleEditando((prev) => ({ ...prev, itemId: e.target.value }))}
            >
              <option value="">-- Seleccionar item --</option>
              {items.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Cantidad <span className="text-danger">*</span></CFormLabel>
            <CFormInput
              type="number"
              min={1}
              value={detalleEditando?.cantidad ?? 1}
              onChange={(e) => setDetalleEditando((prev) => ({ ...prev, cantidad: Number(e.target.value) }))}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Valor</CFormLabel>
            <CFormInput
              type="number"
              step="0.01"
              value={detalleEditando?.valor ?? 0}
              onChange={(e) => setDetalleEditando((prev) => ({ ...prev, valor: Number(e.target.value) }))}
            />
          </div>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetalleModalVisible(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={confirmarDetalle}>{detalleIndex === -1 ? 'Agregar' : 'Guardar'}</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={eliminarVisible} onClose={() => setEliminarVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>¿Estás seguro de que deseas eliminar el recibo de sueldo con fecha{' '}
            <strong>{paraEliminar?.fechaDePago ? formatearFecha(paraEliminar.fechaDePago) : ''}</strong>?
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEliminarVisible(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={ejecutarBorrar}>Eliminar Recibo de Sueldo</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={confirmandoDetalle !== null} onClose={() => setConfirmandoDetalle(null)}>
        <CModalHeader>
          <CModalTitle>Confirmar</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>¿Eliminar este detalle?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmandoDetalle(null)}>Cancelar</CButton>
          <CButton color="danger" onClick={ejecutarEliminarDetalle}>Eliminar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={errorVisible} onClose={() => setErrorVisible(false)}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>{errorMensaje}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setErrorVisible(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ReciboPage
