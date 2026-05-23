import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import { cilCloudUpload, cilSearch } from '@coreui/icons'

const RegistroHorarioPage = () => {
  const { apiFetch } = useApi()
  const [empleados, setEmpleados] = useState([])

  const [modalVisible, setModalVisible] = useState(false)
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null)
  const [observacion, setObservacion] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [tipoDocumentacion, setTipoDocumentacion] = useState('')
  const [modalVerVisible, setModalVerVisible] = useState(false)
  const [justificacion, setJustificacion] = useState(null)
  const [cargandoJustificacion, setCargandoJustificacion] = useState(false)

  useEffect(() => {
    apiFetch('http://localhost:9000/api/v1/empleado')
      .then((res) => res.json())
      .then((data) =>
        setEmpleados(data.map((e) => ({ value: e.id, label: `${e.nombre} ${e.apellido}` }))),
      )
      .catch(() => {})
  }, [])

  const descargarArchivo = async () => {
    try {
      const res = await apiFetch(
        `http://localhost:9000/api/v1/documentacion/files/${justificacion.documentacion.id}`,
      )
      const contentDisposition = res.headers.get('Content-Disposition')
      const filename = contentDisposition?.split('filename="')[1]?.replace('"', '')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar el archivo:', error)
    }
  }

  const abrirModalVer = async (item) => {
    setJustificacion(null)
    setModalVerVisible(true)
    setCargandoJustificacion(true)
    try {
      const res = await apiFetch(
        `http://localhost:9000/api/v1/justificacion/registroHorario/${item.id}`,
      )
      const data = await res.json()
      setJustificacion(data)
    } catch {
      setJustificacion(null)
    } finally {
      setCargandoJustificacion(false)
    }
  }

  const abrirModalSubir = (item) => {
    setRegistroSeleccionado(item)
    setObservacion('')
    setArchivo(null)
    setErrorModal('')
    setModalVisible(true)
  }

  const cerrarModal = () => {
    setModalVisible(false)
    setRegistroSeleccionado(null)
  }

  const subirJustificacion = async () => {
    setGuardando(true)
    setErrorModal('')
    try {
      if (tipoDocumentacion.trim() === '') {
        throw new Error('El tipo de documentación es obligatorio')
      }
      if (archivo === null) {
        throw new Error('Debe subir un archivo')
      }
      const formData = new FormData()
      formData.append('registroHorarioId', registroSeleccionado.id)
      formData.append('observacion', observacion)
      formData.append('tipoDocumentacion', tipoDocumentacion)
      if (archivo) formData.append('archivo', archivo)

      await apiFetch('http://localhost:9000/api/v1/justificacion/crear', {
        method: 'POST',
        body: formData,
      })
      cerrarModal()
    } catch (error) {
      setErrorModal(error.message || 'Error al subir la justificación.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <GenericPage
        apiBase="http://localhost:9000/api/v1/registroHorario"
        tituloLista="Lista de ingresos y egresos"
        titulos={{
          editar: 'Modificar Registro',
          ver: 'Detalle del Registro',
        }}
        columns={[
          {
            key: 'empleado',
            label: 'Empleado',
            render: (value) => (value ? `${value.nombre} ${value.apellido}` : ''),
          },
          {
            key: 'fechaEntrada',
            label: 'Fecha de entrada',
            render: (value) =>
              value
                ? new Date(value).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '',
          },
          {
            key: 'fechaSalida',
            label: 'Fecha de salida',
            render: (value) =>
              value
                ? new Date(value).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '',
          },
          { key: 'estadoRegistroHorario', label: 'Estado' },
          { key: 'observacion', label: 'Observación' },
        ]}
        accionesExtra={[
          {
            label: 'Ver justificación',
            icon: cilSearch,
            onClick: abrirModalVer,
          },
          {
            label: 'Subir justificación',
            icon: cilCloudUpload,
            onClick: abrirModalSubir,
          },
        ]}
        fields={[
          {
            key: 'fechaEntrada',
            label: 'Fecha de entrada',
            type: 'datetime-local',
            required: true,
          },
          {
            key: 'fechaSalida',
            label: 'Fecha de salida',
            type: 'datetime-local',
            required: false,
          },
          {
            key: 'empleado',
            label: 'Empleado',
            type: 'select',
            required: true,
            options: empleados,
          },
          {
            key: 'estadoRegistroHorario',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
              { value: 'PRESENTE', label: 'Presente' },
              { value: 'AUSENTE', label: 'Ausente' },
            ],
          },
          {
            key: 'observacion',
            label: 'Observación',
            type: 'textarea',
            required: false,
          },
        ]}
        deleteMessage={(item) => (
          <p>
            ¿Estás seguro de que deseas eliminar el registro del{' '}
            <strong>{item?.fechaEntrada}</strong>?
          </p>
        )}
        deleteButtonText="Eliminar Registro"
        permitirCrear={false}
      />

      <CModal visible={modalVisible} onClose={cerrarModal}>
        <CModalHeader>
          <CModalTitle>Subir justificación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>
              Archivo adjunto <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput type="file" onChange={(e) => setArchivo(e.target.files[0] || null)} />
          </div>
          <div className="mb-3">
            <CFormLabel>
              Tipo de documentación <span className="text-danger">*</span>{' '}
            </CFormLabel>
            <CFormSelect
              options={[
                { label: 'Selecciona el tipo de documentación', value: '' },
                { label: 'Certificado', value: 'CERTIFICADO' },
                { label: 'Otro', value: 'OTRO' },
              ]}
              onChange={(e) => setTipoDocumentacion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Observación</CFormLabel>
            <CFormTextarea
              rows={3}
              placeholder="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>
          {errorModal && <p className="text-danger mb-0">{errorModal}</p>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={cerrarModal} disabled={guardando}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={subirJustificacion} disabled={guardando}>
            {guardando ? 'Subiendo...' : 'Subir'}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={modalVerVisible} onClose={() => setModalVerVisible(false)}>
        <CModalHeader>
          <CModalTitle>Ver justificación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {cargandoJustificacion && <p>Cargando...</p>}
          {!cargandoJustificacion && !justificacion && (
            <p className="text-muted">Este registro no tiene justificación cargada.</p>
          )}
          {!cargandoJustificacion && justificacion && (
            <>
              <div className="mb-3">
                <CFormLabel>Tipo de documentación</CFormLabel>
                <CFormSelect value={justificacion.documentacion.tipoDocumentacion || ''} disabled>
                  <option value="">-- Sin especificar --</option>
                  <option value="CERTIFICADO">Certificado</option>
                  <option value="OTRO">Otro</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Observacion</CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={justificacion.documentacion.observacion || ''}
                  disabled
                />
              </div>
              {justificacion.archivo && (
                <div className="mb-3">
                  <CFormLabel>Archivo adjunto</CFormLabel>
                  <div>
                    <a href={justificacion.archivo} target="_blank" rel="noreferrer">
                      Ver archivo
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVerVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={descargarArchivo}>
            Descargar documentación
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default RegistroHorarioPage
