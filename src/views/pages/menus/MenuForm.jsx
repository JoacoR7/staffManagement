import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CFormTextarea,
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

const tablaHeaderStyle = {
  width: '50%',
  fontWeight: 500,
  fontSize: '13px',
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

const MenuForm = ({ modo, entity, onClose, onGuardar }) => {
  const { apiFetch } = useApi()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [articulosDisponibles, setArticulosDisponibles] = useState([])
  const [detalles, setDetalles] = useState([])

  const soloLectura = modo === 'ver'

  const cargarDatos = async () => {
    const artResp = await apiFetch('http://localhost:9000/api/v1/articulo')
    const articulosData = await artResp.json()

    setArticulosDisponibles(
      (Array.isArray(articulosData) ? articulosData : []).map((a) => ({
        value: a.id,
        label: a.nombre,
        descripcion: a.descripcion,
      })),
    )
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos()
  }, [])

  useEffect(() => {
    if (entity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNombre(entity.nombre || '')
      setDescripcion(entity.descripcion || '')
      setPrecio(entity.precio ?? '')
      setDetalles(entity.detalles || [])
    }
  }, [entity])

  const agregarDetalle = () => {
    setDetalles((prev) => [
      ...prev,
      {
        id: '',
        cantidad: 1,
        articuloId: '',
        articuloNombre: '',
        articuloDescripcion: '',
      },
    ])
  }

  const eliminarDetalle = (index) => {
    const copia = [...detalles]
    copia.splice(index, 1)
    setDetalles(copia)
  }

  const cambiarArticulo = (index, articuloId) => {
    const articulo = articulosDisponibles.find((a) => a.value === articuloId)
    const copia = [...detalles]
    copia[index] = {
      ...copia[index],
      articuloId: articulo?.value || '',
      articuloNombre: articulo?.label || '',
      articuloDescripcion: articulo?.descripcion || '',
    }
    setDetalles(copia)
  }

  const cambiarCantidad = (index, cantidad) => {
    const copia = [...detalles]
    copia[index] = { ...copia[index], cantidad: Number(cantidad) }
    setDetalles(copia)
  }

  const guardar = () => {
    onGuardar({
      nombre,
      descripcion,
      precio: Number(precio),
      detalles: detalles
        .filter((d) => d.articuloId)
        .map((d) => ({
          cantidad: d.cantidad,
          articuloId: d.articuloId,
        })),
    })
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>
          {modo === 'crear' ? 'Nuevo Menú' : modo === 'editar' ? 'Editar Menú' : 'Detalle del Menú'}
        </strong>
      </CCardHeader>

      <CCardBody>
        <div className="row mb-3">
          <div className="col-md-8">
            <CFormLabel>Nombre</CFormLabel>
            <CFormInput
              value={nombre}
              disabled={soloLectura}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Menú Ejecutivo"
            />
          </div>
          <div className="col-md-4">
            <CFormLabel>Precio</CFormLabel>
            <CFormInput
              type="number"
              value={precio}
              disabled={soloLectura}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              min="0"
              step="100"
            />
          </div>
        </div>

        <div className="mb-3">
          <CFormLabel>Descripción</CFormLabel>
          <CFormTextarea
            value={descripcion}
            disabled={soloLectura}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Ej: Milanesa con huevo frito y perejil"
          />
        </div>

        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{
            borderTop: '2px solid var(--cui-border-color)',
            paddingTop: '1rem',
          }}
        >
          <span className="fw-semibold fs-6" style={{ color: 'var(--cui-body-color)' }}>
            Artículos
          </span>
          <CBadge color="secondary" shape="rounded-pill">
            {detalles.length}
          </CBadge>
        </div>

        {detalles.length > 0 && (
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
                <CTableHeaderCell style={tablaHeaderStyle}>Artículo</CTableHeaderCell>
                <CTableHeaderCell style={{ ...tablaHeaderStyle, width: '20%' }}>
                  Cantidad
                </CTableHeaderCell>
                {!soloLectura && <CTableHeaderCell style={{ width: '1%' }} />}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {detalles.map((detalle, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <Select
                      isDisabled={soloLectura}
                      options={articulosDisponibles}
                      value={
                        articulosDisponibles.find((a) => a.value === detalle.articuloId) || null
                      }
                      onChange={(selected) => cambiarArticulo(index, selected?.value)}
                      placeholder="Seleccionar artículo..."
                      styles={selectStyles}
                    />
                  </CTableDataCell>

                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      value={detalle.cantidad}
                      disabled={soloLectura}
                      onChange={(e) => cambiarCantidad(index, e.target.value)}
                      min="1"
                      style={{ minWidth: '90px' }}
                    />
                  </CTableDataCell>

                  {!soloLectura && (
                    <CTableDataCell className="text-center" style={{ verticalAlign: 'middle' }}>
                      <BotonEliminar
                        onClick={() => eliminarDetalle(index)}
                        title="Quitar artículo"
                      />
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {!soloLectura && <BotonAgregar onClick={agregarDetalle}>Agregar artículo</BotonAgregar>}
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

export default MenuForm
