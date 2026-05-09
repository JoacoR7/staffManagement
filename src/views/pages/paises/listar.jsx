import React, { useEffect, useState } from 'react'
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
import { cilOptions, cilTrash, cilPencil, cilSearch } from '@coreui/icons'

const Tables = () => {

  const [paises, setPaises] = useState([])

  useEffect(() => {
    fetch('http://localhost:9000/api/v1/pais')
      .then((response) => response.json())
      .then((data) => setPaises(data))
      .catch((error) => console.error('Error al cargar países:', error))
  }, [])

  return (
    <CCard className="mb-4 shadow-sm">

      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Lista de Países</h4>
        <CButton color="primary">Agregar</CButton>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive={false}>

          <CTableHead>
            <CTableRow>
              <CTableHeaderCell
                className="text-center"
                style={{ width: '120px' }}
                scope="col"
              >
                Acciones
              </CTableHeaderCell>

              <CTableHeaderCell scope="col">
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
                      caret={true}
                    >
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>

                    <CDropdownMenu>

                      <CDropdownItem
                        onClick={() => console.log('Consultar', pais.id)}
                      >
                        <CIcon icon={cilSearch} className="me-2" />
                        Consultar
                      </CDropdownItem>

                      <CDropdownItem
                        onClick={() => console.log('Modificar', pais.id)}
                      >
                        <CIcon icon={cilPencil} className="me-2" />
                        Modificar
                      </CDropdownItem>

                      <CDropdownItem
                        className="text-danger"
                        onClick={() => console.log('Borrar', pais.id)}
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
      </CCardBody>

    </CCard>
  )
}

export default Tables