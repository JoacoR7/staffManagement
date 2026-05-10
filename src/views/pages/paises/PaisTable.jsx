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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilOptions,
  cilTrash,
  cilPencil,
  cilSearch,
} from '@coreui/icons'

const PaisTable = ({ paises, onAgregar }) => {
  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Lista de Países</h4>

        <CButton color="primary" onClick={onAgregar}>
          Agregar
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive={false}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell
                className="text-center"
                style={{ width: '120px' }}
              >
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
                      caret
                    >
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>

                    <CDropdownMenu>
                      <CDropdownItem>
                        <CIcon icon={cilSearch} className="me-2" />
                        Consultar
                      </CDropdownItem>

                      <CDropdownItem>
                        <CIcon icon={cilPencil} className="me-2" />
                        Modificar
                      </CDropdownItem>

                      <CDropdownItem className="text-danger">
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
      </CCardBody>
    </CCard>
  )
}

export default PaisTable