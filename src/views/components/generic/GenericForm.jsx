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
  CFormCheck,
} from '@coreui/react'

/**
 * GenericForm
 *
 * Props:
 * - modo          {string}   'crear' | 'editar' | 'ver'
 * - entity        {Object}   El objeto a editar/ver, o null para crear.
 * - onClose       {Function} Callback para cerrar/cancelar.
 * - onGuardar     {Function} Callback recibe el payload a guardar.
 * - titulos       {Object}   Ej: { crear: 'Nuevo País', editar: 'Modificar País', ver: 'Detalle del País' }
 * - fields        {Array}    Definición de campos del formulario. Ver estructura abajo.
 *
 * Estructura de cada campo en `fields`:
 * {
 *   key:         {string}          Nombre de la propiedad en el objeto (ej: 'nombre').
 *   label:       {string}          Etiqueta visible (ej: 'Nombre del País').
 *   type:        {string}          'text' | 'number' | 'email' | 'select' | 'textarea' | 'checkbox'
 *                                  (default: 'text')
 *   placeholder: {string}          Texto de placeholder (opcional).
 *   options:     {Array}           Solo para type='select': [{ value, label }, ...]
 *   required:    {boolean}         Marcar el campo como requerido (opcional).
 *   defaultValue {any}             Valor por defecto al crear (opcional).
 * }
 */
const GenericForm = ({ modo, entity, onClose, onGuardar, titulos, fields }) => {
  const [formData, setFormData] = useState({})

  useEffect(() => {
    // Inicializa el estado con los valores del entity o los defaultValue de cada campo
    const initial = {}
    fields.forEach((field) => {
      if (entity && entity[field.key] !== undefined) {
        initial[field.key] = entity[field.key]
      } else {
        initial[field.key] = field.defaultValue ?? (field.type === 'checkbox' ? false : '')
      }
    })
    // Preservar campos ocultos necesarios para el backend (id, eliminado, etc.)
    if (entity?.id !== undefined) initial.id = entity.id
    if (entity?.eliminado !== undefined) initial.eliminado = entity.eliminado
    setFormData(initial)
  }, [entity])

  const soloLectura = modo === 'ver'

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const renderField = (field) => {
    const value = formData[field.key] ?? ''
    const commonProps = {
      disabled: soloLectura,
    }

    switch (field.type) {
      case 'select':
        return (
          <CFormSelect
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </CFormSelect>
        )

      case 'textarea':
        return (
          <CFormTextarea
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={value}
            rows={3}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        )

      case 'checkbox':
        return (
          <CFormCheck
            {...commonProps}
            checked={!!value}
            onChange={(e) => handleChange(field.key, e.target.checked)}
          />
        )

      default:
        return (
          <CFormInput
            {...commonProps}
            type={field.type || 'text'}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        )
    }
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader>
        <strong>{titulos?.[modo] || modo}</strong>
      </CCardHeader>

      <CCardBody>
        {fields.map((field) => (
          <div className="mb-3" key={field.key}>
            <CFormLabel>
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </CFormLabel>
            {renderField(field)}
          </div>
        ))}
      </CCardBody>

      <CCardFooter className="d-flex justify-content-end gap-2">
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        {!soloLectura && (
          <CButton color="primary" onClick={() => onGuardar(formData)}>
            Guardar
          </CButton>
        )}
      </CCardFooter>
    </CCard>
  )
}

export default GenericForm
