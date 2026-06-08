import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { API_URL } from '@/config'

const MovimientoStockPage = () => {
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    cargarStocks()
  }, [])

  const cargarStocks = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/v1/articulo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      const opciones = data
        .map((articulo) => {
          const stockActivo = articulo.stocks?.find(
            (s) => !s.eliminado
          )

          if (!stockActivo) return null

          return {
            value: stockActivo.id,
            label: articulo.nombre,
          }
        })
        .filter(Boolean)

      setStocks(opciones)
    } catch (error) {
      console.error('Error cargando stocks', error)
    }
  }

  return (
    <GenericPage
      apiBase={`${API_URL}/api/v1/movimiento-stock`}
      tituloLista="Lista de movimientos de stock"
      titulos={{
        crear: 'Nuevo movimiento de stock',
        editar: 'Modificar movimiento de stock',
        ver: 'Detalle de movimiento de stock',
      }}
      columns={[
        { key: 'stock.articulo.nombre', label: 'Artículo' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'tipoMovimiento', label: 'Tipo' },
      ]}
      fields={[
        {
          key: 'stock',
          label: 'Artículo',
          type: 'select',
          required: true,
          options: stocks,
        },
        {
          key: 'cantidad',
          label: 'Cantidad',
          type: 'number',
          placeholder: 'Ej: 100',
          required: true,
          min: 0,
        },
        {
          key: 'tipoMovimiento',
          label: 'Tipo',
          type: 'select',
          required: true,
          rawValue: true,
          options: [
            { value: 'ENTRADA', label: 'Entrada' },
            { value: 'SALIDA', label: 'Salida' },
          ],
        },
      ]}
      deleteMessage={(item) => (
        <p>
          ¿Estás seguro de que deseas eliminar el movimiento de stock del producto{' '}
          <strong>{item?.stock?.articulo?.nombre}</strong>?
        </p>
      )}
      deleteButtonText="Eliminar Movimiento de Stock"
    />
  )
}

export default MovimientoStockPage