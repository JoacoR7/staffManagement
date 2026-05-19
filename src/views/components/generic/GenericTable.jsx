import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilTrash, cilPencil, cilSearch } from '@coreui/icons'

/**
 * GenericTable
 *
 * Props:
 * - titulo         {string}   Título del encabezado de la tabla. Ej: "Lista de Países"
 * - items          {Array}    Array de objetos a mostrar.
 * - columns        {Array}    Definición de columnas: [{ key: 'nombre', label: 'Nombre' }, ...]
 * - onAgregar      {Function} Callback para abrir el formulario de creación.
 * - onEditar       {Function} Callback recibe el item seleccionado.
 * - onConsultar    {Function} Callback recibe el item seleccionado.
 * - onBorrar       {Function} Callback recibe el item seleccionado.
 * - paginaActual   {number}   Índice de la página actual (base 0).
 * - totalPaginas   {number}   Total de páginas disponibles.
 * - onCambiarPagina {Function} Callback recibe el nuevo índice de página.
 */
const GenericTable = ({
  titulo,
  items,
  columns,
  onAgregar,
  onEditar,
  onConsultar,
  onBorrar,
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{titulo}</h4>
        <CButton color="primary" onClick={onAgregar}>
          Agregar
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive={false}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '120px' }} className="text-center">
                Acciones
              </CTableHeaderCell>
              {columns.map((col) => (
                <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="text-center">
                  <CDropdown>
                    <CDropdownToggle color="primary" variant="outline" size="sm">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => onConsultar(item)}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Consultar
                      </CDropdownItem>
                      <CDropdownItem onClick={() => onEditar(item)}>
                        <CIcon icon={cilPencil} className="me-2" />
                        Modificar
                      </CDropdownItem>
                      <CDropdownItem className="text-danger" onClick={() => onBorrar(item)}>
                        <CIcon icon={cilTrash} className="me-2" />
                        Borrar
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>

                {columns.map((col) => (
                  <CTableDataCell key={col.key}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="d-flex justify-content-center mt-3">
          <CPagination align="center">
            <CPaginationItem
              disabled={paginaActual === 0}
              onClick={() => onCambiarPagina(paginaActual - 1)}
              style={{ cursor: 'pointer' }}
            >
              Anterior
            </CPaginationItem>

            {[...Array(totalPaginas)].map((_, index) => (
              <CPaginationItem
                key={index}
                active={index === paginaActual}
                onClick={() => onCambiarPagina(index)}
                style={{ cursor: 'pointer' }}
              >
                {index + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={paginaActual === totalPaginas - 1 || totalPaginas === 0}
              onClick={() => onCambiarPagina(paginaActual + 1)}
              style={{ cursor: 'pointer' }}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default GenericTable
