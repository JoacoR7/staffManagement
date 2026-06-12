import React from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const FormaDePagoPage = () => (
  <GenericPage
    apiBase={`${API_URL}/api/v1/formaDePago`}
    tituloLista="Lista de Formas de Pago"
    titulos={{
      crear: 'Nueva Forma de Pago',
      editar: 'Modificar Forma de Pago',
      ver: 'Detalle de la Forma de Pago',
    }}
    columns={[
      { key: 'metodoPago', label: 'Método de Pago' },
      { key: 'observacion', label: 'Observación' },
    ]}
    fields={[
      {
        key: 'metodoPago',
        label: 'Método de Pago',
        type: 'select',
        rawValue: true,
        options: [
          { value: 'EFECTIVO', label: 'Efectivo' },
          { value: 'TARJETA_DE_DEBITO', label: 'Tarjeta de Débito' },
          { value: 'TARJETA_DE_CREDITO', label: 'Tarjeta de Crédito' },
          { value: 'QR', label: 'QR' },
          { value: 'TRANSFERENCIA', label: 'Transferencia' },
          { value: 'BILLETERA_VIRTUAL', label: 'Billetera Virtual' },
        ],
        required: true,
      },
      {
        key: 'observacion',
        label: 'Observación',
        placeholder: 'Descripción opcional',
        required: false,
      },
    ]}
    deleteMessage={(item) => (
      <p>
        ¿Estás seguro de que deseas eliminar la forma de pago{' '}
        <strong>{item?.metodoPago}</strong>?
      </p>
    )}
    deleteButtonText="Eliminar Forma de Pago"
  />
)

export default FormaDePagoPage
