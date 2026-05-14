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
import {
  cilOptions,
  cilTrash,
  cilPencil,
  cilSearch,
} from '@coreui/icons'

const PaisTable = ({
  paises,
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
        <h4 className="mb-0">Lista de Países</h4>

        <CButton color="primary" onClick={onAgregar}>
          Agregar
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '120px' }} className="text-center">
                Acciones
              </CTableHeaderCell>

              <CTableHeaderCell>
                Nombre
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {paises.map((pais) => (
              <CTableRow key={pais.id}>
                <CTableDataCell className="text-center">
                  <CDropdown>
                    <CDropdownToggle
                      color="primary"
                      variant="outline"
                      size="sm"
                    >
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>

                    <CDropdownMenu>
                      <CDropdownItem onClick={() => onConsultar(pais)}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Consultar
                      </CDropdownItem>

                      <CDropdownItem onClick={() => onEditar(pais)}>
                        <CIcon icon={cilPencil} className="me-2" />
                        Modificar
                      </CDropdownItem>

                      <CDropdownItem
                        className="text-danger"
                        onClick={() => onBorrar(pais)}
                      >
                        <CIcon icon={cilTrash} className="me-2" />
                        Borrar
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>

                <CTableDataCell>
                  {pais.nombre}
                </CTableDataCell>
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

export default PaisTable