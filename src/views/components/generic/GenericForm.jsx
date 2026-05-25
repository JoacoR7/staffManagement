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
      // ── Valor inicial custom ─────────────────────────────
      if (field.initialValue) {
        initial[field.key] = field.initialValue(entity)
      }

      // ── Comportamiento normal ────────────────────────────
      else if (entity && entity[field.key] !== undefined) {
        if (field.type === 'select' && entity[field.key] && typeof entity[field.key] === 'object') {
          initial[field.key] = entity[field.key].id
        } else if (field.type === 'datetime-local' && entity[field.key]) {
          initial[field.key] = entity[field.key].slice(0, 16)
        } else if (field.type === 'date' && entity[field.key]) {
          initial[field.key] = entity[field.key].slice(0, 10)
        } else {
          initial[field.key] = entity[field.key]
        }
      } else {
        initial[field.key] = field.defaultValue ?? (field.type === 'checkbox' ? false : '')
      }
    })
    // Preservar campos ocultos necesarios para el backend (id, eliminado, etc.)
    if (entity?.id !== undefined) initial.id = entity.id
    if (entity?.eliminado !== undefined) initial.eliminado = entity.eliminado
    setFormData(initial)
    fields.forEach((field) => {
      if (field.onChangeExtra && initial[field.key]) {
        field.onChangeExtra(initial[field.key])
      }
    })
  }, [entity])

  const soloLectura = modo === 'ver'

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field.key]: value,
    }))

    if (field.onChangeExtra) {
      field.onChangeExtra(value)
    }
  }

  const renderField = (field) => {
    const value = formData[field.key] ?? ''
    const commonProps = {
      disabled: soloLectura || field.disabled,
    }

    switch (field.type) {
      case 'select':
        return (
          <CFormSelect
            key={`${field.key}-${(field.options || []).length}`}
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
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
            onChange={(e) => handleChange(field, e.target.value)}
          />
        )

      case 'checkbox':
        return (
          <CFormCheck
            {...commonProps}
            checked={!!value}
            onChange={(e) => handleChange(field, e.target.checked)}
          />
        )

      case 'file':
        return soloLectura ? (
          value ? (
            <img src={value} alt="foto" style={{ maxWidth: '150px', borderRadius: '4px' }} />
          ) : null
        ) : (
          <CFormInput
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(field.key, e.target.files[0] || null)}
          />
        )

      default:
        return (
          <CFormInput
            {...commonProps}
            type={field.type || 'text'}
            placeholder={field.placeholder || ''}
            value={value}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => handleChange(field, e.target.value)}
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
            {field.type === 'checkbox' ? (
              <CFormCheck
                label={
                  <>
                    {field.label}
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </>
                }
                checked={!!formData[field.key]}
                disabled={soloLectura}
                onChange={(e) => handleChange(field, e.target.checked)}
              />
            ) : (
              <>
                <CFormLabel>
                  {field.label}
                  {field.required && <span className="text-danger ms-1">*</span>}
                </CFormLabel>

                {renderField(field)}
              </>
            )}
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
