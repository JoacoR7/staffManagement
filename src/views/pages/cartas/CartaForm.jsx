import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPlus } from '@coreui/icons'
import Select from 'react-select'
import { useApi } from '@/hooks/useApi'

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--cui-body-bg)',
    borderColor: 'var(--cui-border-color)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--cui-body-bg)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--cui-body-color)',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--cui-body-color)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--cui-tertiary-bg)' : 'var(--cui-body-bg)',
    color: 'var(--cui-body-color)',
    cursor: 'pointer',
  }),
}

const categoriaCardStyle = {
  border: '1px solid var(--cui-border-color)',
  borderRadius: '8px',
  marginBottom: '1.25rem',
}

const categoriaHeaderStyle = {
  backgroundColor: 'var(--cui-tertiary-bg)',
  padding: '0.6rem 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--cui-border-color)',
}

const numeroBadgeStyle = {
  background: 'var(--cui-primary)',
  color: '#fff',
  fontWeight: 600,
  minWidth: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  fontSize: '12px',
}

const articulosSeparadorStyle = {
  borderTop: '1px dashed var(--cui-border-color)',
  paddingTop: '0.75rem',
}

const BotonEliminar = ({ onClick, title }) => (
  <CButton
    color="danger"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    style={{ padding: '0.2rem 0.4rem', lineHeight: 1 }}
  >
    <CIcon icon={cilTrash} size="sm" />
  </CButton>
)

const BotonAgregar = ({ onClick, children }) => (
  <CButton color="success" variant="outline" size="sm" onClick={onClick}>
    <CIcon icon={cilPlus} size="sm" className="me-1" />
    {children}
  </CButton>
)

// Componente principal

const CartaForm = ({ modo, entity, onClose, onGuardar }) => {
  const { apiFetch } = useApi()

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [nombre, setNombre] = useState('')
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([])
  const [articulosDisponibles, setArticulosDisponibles] = useState([])
  const [categorias, setCategorias] = useState([])

  const soloLectura = modo === 'ver'

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (entity) {
      setNombre(entity.nombre || '')
      setFechaDesde(entity.fechaDesde?.slice(0, 10) || '')
      setFechaHasta(entity.fechaHasta?.slice(0, 10) || '')
      setCategorias(entity.categorias || [])
    }
  }, [entity])

  const cargarDatos = async () => {
    const [catResp, artResp] = await Promise.all([
      apiFetch('http://localhost:9000/api/v1/categoria'),
      apiFetch('http://localhost:9000/api/v1/articulo'),
    ])

    const categoriasData = await catResp.json()
    const articulosData = await artResp.json()

    setCategoriasDisponibles(categoriasData.map((c) => ({ value: c.id, label: c.nombre })))
    setArticulosDisponibles(
      articulosData.map((a) => ({ value: a.id, label: a.nombre, descripcion: a.descripcion })),
    )
  }

  const agregarCategoria = () => {
    setCategorias([...categorias, { id: '', nombre: '', productos: [] }])
  }

  const cambiarCategoria = (index, categoriaId) => {
    const categoria = categoriasDisponibles.find((c) => c.value === categoriaId)
    const copia = [...categorias]
    copia[index] = { ...copia[index], id: categoria.value, nombre: categoria.label }
    setCategorias(copia)
  }

  const agregarArticulo = (categoriaIndex) => {
    const copia = [...categorias]
    copia[categoriaIndex].productos.push({ id: '', nombre: '', descripcion: '', precio: 0 })
    setCategorias(copia)
  }

  const eliminarArticulo = (categoriaIndex, articuloIndex) => {
    const copia = [...categorias]
    copia[categoriaIndex].productos.splice(articuloIndex, 1)
    setCategorias(copia)
  }

  const eliminarCategoria = (categoriaIndex) => {
    const copia = [...categorias]
    copia.splice(categoriaIndex, 1)
    setCategorias(copia)
  }

  const cambiarArticulo = (categoriaIndex, articuloIndex, articuloId) => {
    const articulo = articulosDisponibles.find((a) => a.value === articuloId)
    const copia = [...categorias]
    copia[categoriaIndex].productos[articuloIndex] = {
      ...copia[categoriaIndex].productos[articuloIndex],
      id: articulo.value,
      nombre: articulo.label,
      descripcion: articulo.descripcion,
    }
    setCategorias(copia)
  }

  const cambiarPrecio = (categoriaIndex, articuloIndex, precio) => {
    const copia = [...categorias]
    copia[categoriaIndex].productos[articuloIndex].precio = Number(precio)
    setCategorias(copia)
  }

  const guardar = () => {
    onGuardar({ nombre, fechaDesde, fechaHasta, categorias })
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>
          {modo === 'crear' ? 'Nueva Carta' : modo === 'editar' ? 'Editar Carta' : 'Detalle Carta'}
        </strong>
      </CCardHeader>

      <CCardBody>
        <div className="mb-3">
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            value={nombre}
            disabled={soloLectura}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Carta Invierno 2026"
          />
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <CFormLabel>Fecha Desde</CFormLabel>
            <CFormInput
              type="date"
              value={fechaDesde}
              disabled={soloLectura}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <CFormLabel>Fecha Hasta</CFormLabel>
            <CFormInput
              type="date"
              value={fechaHasta}
              disabled={soloLectura}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{ borderTop: '2px solid var(--cui-border-color)', paddingTop: '1rem' }}
        >
          <span className="fw-semibold fs-6" style={{ color: 'var(--cui-body-color)' }}>
            Categorías y artículos
          </span>
          <CBadge color="secondary" shape="rounded-pill">
            {categorias.length}
          </CBadge>
        </div>

        {categorias.map((categoria, categoriaIndex) => (
          <div key={categoriaIndex} style={categoriaCardStyle}>
            <div style={categoriaHeaderStyle}>
              <div className="d-flex align-items-center gap-2">
                <CBadge style={numeroBadgeStyle}>{categoriaIndex + 1}</CBadge>
                <span className="fw-semibold" style={{ color: 'var(--cui-body-color)' }}>
                  {categoria.nombre || 'Sin categoría seleccionada'}
                </span>
              </div>

              {!soloLectura && (
                <BotonEliminar
                  onClick={() => eliminarCategoria(categoriaIndex)}
                  title="Eliminar categoría"
                />
              )}
            </div>

            <div style={{ padding: '1rem' }}>
              <div className="mb-3">
                <CFormLabel className="text-muted" style={{ fontSize: '13px' }}>
                  Categoría
                </CFormLabel>
                <Select
                  isDisabled={soloLectura}
                  options={categoriasDisponibles}
                  value={categoriasDisponibles.find((c) => c.value === categoria.id) || null}
                  onChange={(selected) => cambiarCategoria(categoriaIndex, selected?.value)}
                  placeholder="Seleccionar categoría..."
                  styles={selectStyles}
                />
              </div>

              {/* Sub-sección artículos */}
              <div className="d-flex align-items-center gap-2 mb-2" style={articulosSeparadorStyle}>
                <span style={{ fontSize: '13px', color: 'var(--cui-secondary-color)' }}>
                  Artículos
                </span>
                <CBadge color="secondary" shape="rounded-pill" style={{ fontSize: '11px' }}>
                  {categoria.productos.length}
                </CBadge>
              </div>

              {categoria.productos.length > 0 && (
                <CTable
                  small
                  bordered
                  style={{
                    fontSize: '14px',
                    marginBottom: '0.75rem',
                    background: 'var(--cui-body-bg)',
                  }}
                >
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '50%', fontWeight: 500, fontSize: '13px' }}>
                        Artículo
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ width: '25%', fontWeight: 500, fontSize: '13px' }}>
                        Precio
                      </CTableHeaderCell>
                      {!soloLectura && <CTableHeaderCell style={{ width: '1%' }} />}
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {categoria.productos.map((producto, articuloIndex) => (
                      <CTableRow key={articuloIndex}>
                        <CTableDataCell>
                          <Select
                            isDisabled={soloLectura}
                            options={articulosDisponibles}
                            value={
                              articulosDisponibles.find((a) => a.value === producto.id) || null
                            }
                            onChange={(selected) =>
                              cambiarArticulo(categoriaIndex, articuloIndex, selected?.value)
                            }
                            placeholder="Seleccionar artículo..."
                            styles={selectStyles}
                          />
                        </CTableDataCell>

                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            value={producto.precio}
                            disabled={soloLectura}
                            onChange={(e) =>
                              cambiarPrecio(categoriaIndex, articuloIndex, e.target.value)
                            }
                            style={{ minWidth: '90px' }}
                          />
                        </CTableDataCell>

                        {!soloLectura && (
                          <CTableDataCell
                            className="text-center"
                            style={{ verticalAlign: 'middle' }}
                          >
                            <BotonEliminar
                              onClick={() => eliminarArticulo(categoriaIndex, articuloIndex)}
                              title="Quitar artículo"
                            />
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              {!soloLectura && (
                <BotonAgregar onClick={() => agregarArticulo(categoriaIndex)}>
                  Agregar artículo
                </BotonAgregar>
              )}
            </div>
          </div>
        ))}

        {!soloLectura && (
          <CButton color="primary" variant="outline" onClick={agregarCategoria}>
            <CIcon icon={cilPlus} size="sm" className="me-1" />
            Agregar categoría
          </CButton>
        )}
      </CCardBody>

      <CCardFooter className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        {!soloLectura && (
          <CButton color="primary" onClick={guardar}>
            Guardar
          </CButton>
        )}
      </CCardFooter>
    </CCard>
  )
}

export default CartaForm
