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
} from '@coreui/react'
import Select from 'react-select'
import { useApi } from '@/hooks/useApi'

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

    setCategoriasDisponibles(
      categoriasData.map((c) => ({
        value: c.id,
        label: c.nombre,
      })),
    )

    setArticulosDisponibles(
      articulosData.map((a) => ({
        value: a.id,
        label: a.nombre,
        descripcion: a.descripcion,
      })),
    )
  }

  const agregarCategoria = () => {
    setCategorias([
      ...categorias,
      {
        id: '',
        nombre: '',
        productos: [],
      },
    ])
  }

  const cambiarCategoria = (index, categoriaId) => {
    const categoria = categoriasDisponibles.find((c) => c.value === categoriaId)

    const copia = [...categorias]

    copia[index] = {
      ...copia[index],
      id: categoria.value,
      nombre: categoria.label,
    }

    setCategorias(copia)
  }

  const agregarArticulo = (categoriaIndex) => {
    const copia = [...categorias]

    copia[categoriaIndex].productos.push({
      id: '',
      nombre: '',
      descripcion: '',
      precio: 0,
    })

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
    onGuardar({
      nombre,
      fechaDesde,
      fechaHasta,
      categorias,
    })
  }

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

        <div className="mb-3">
          <CFormLabel>Fecha Desde</CFormLabel>
          <CFormInput
            type="date"
            value={fechaDesde}
            disabled={soloLectura}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <CFormLabel>Fecha Hasta</CFormLabel>
          <CFormInput
            type="date"
            value={fechaHasta}
            disabled={soloLectura}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        {categorias.map((categoria, categoriaIndex) => (
          <CCard key={categoriaIndex} className="mb-4">
            <CCardBody>
              <Select
                isDisabled={soloLectura}
                options={categoriasDisponibles}
                value={categoriasDisponibles.find((c) => c.value === categoria.id)}
                onChange={(selected) => cambiarCategoria(categoriaIndex, selected?.value)}
                styles={selectStyles}
              />

              <CTable className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Artículo</CTableHeaderCell>
                    <CTableHeaderCell>Precio</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {categoria.productos.map((producto, articuloIndex) => (
                    <CTableRow key={articuloIndex}>
                      <CTableDataCell>
                        <Select
                          isDisabled={soloLectura}
                          options={articulosDisponibles}
                          value={articulosDisponibles.find((a) => a.value === producto.id)}
                          onChange={(selected) =>
                            cambiarArticulo(categoriaIndex, articuloIndex, selected?.value)
                          }
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
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {!soloLectura && (
                <CButton color="success" onClick={() => agregarArticulo(categoriaIndex)}>
                  Agregar Artículo
                </CButton>
              )}
            </CCardBody>
          </CCard>
        ))}

        {!soloLectura && (
          <CButton color="primary" onClick={agregarCategoria}>
            Agregar Categoría
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
