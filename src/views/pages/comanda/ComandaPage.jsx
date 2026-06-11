import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'
import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilBan, cilTruck, cilDollar } from '@coreui/icons'
import ComandaForm from './ComandaForm'
import FacturarComandaModal from './FacturarComandaModal'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const formatearFechaHora = (fechaISO) => {
  if (!fechaISO) return '-'
  try {
    const date = new Date(fechaISO)
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return fechaISO
  }
}

const formatearMoneda = (valor) => {
  if (valor == null) return '-'
  return `$ ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const mapeoEstadoComanda = {
  ABIERTA: { color: 'primary', label: 'Abierta' },
  PENDIENTE_DE_ENTREGA: { color: 'warning', label: 'Pendiente de Entrega' },
  FINALIZADA: { color: 'success', label: 'Finalizada' },
  ENTREGA_FALLIDA: { color: 'danger', label: 'Entrega Fallida' },
  ANULADA: { color: 'secondary', label: 'Anulada' },
}

const renderEstadoComanda = (val) => {
  const config = mapeoEstadoComanda[val] || { color: 'dark', label: val }
  return <CBadge color={config.color}>{config.label}</CBadge>
}

const ComandaPage = () => {
  const { apiFetch } = useApi()
  const [itemsCarta, setItemsCarta] = useState([])
  const [promociones, setPromociones] = useState([])
  const [facturandoConfig, setFacturandoConfig] = useState(null)

  useEffect(() => {
    cargarCartaYPromos()
  }, [])

  const cargarCartaYPromos = async () => {
    try {
      const [resArticulos, resMenus, resPromociones] = await Promise.all([
        apiFetch('http://localhost:9000/api/v1/detalleSeccionCartaArticuloIndividual'),
        apiFetch('http://localhost:9000/api/v1/detalleSeccionCartaMenu'),
        apiFetch('http://localhost:9000/api/v1/promocion')
      ])

      let articulosList = []
      let menusList = []
      let promosList = []

      if (resArticulos && resArticulos.ok) {
        const data = await resArticulos.json()
        articulosList = Array.isArray(data) ? data : data.content || []
      }

      if (resMenus && resMenus.ok) {
        const data = await resMenus.json()
        menusList = Array.isArray(data) ? data : data.content || []
      }

      if (resPromociones && resPromociones.ok) {
        const data = await resPromociones.json()
        promosList = Array.isArray(data) ? data : data.content || []
        setPromociones(promosList.map(p => ({ value: p.id, label: `${p.descripcion} (${p.porcentajeDescuento}%)` })))
      }

      const options = [
        ...articulosList.map((ai) => ({
          value: ai.id,
          label: `[Artículo] ${ai.articulo?.nombre || 'Artículo sin nombre'} ($${ai.precio})`,
          nombre: ai.articulo?.nombre || '',
          detalleSeccionCartaID: ai.id,
        })),
        ...menusList.map((m) => {
          const menuNombres = m.menus?.map((menu) => menu.nombre).join(', ') || 'Menú sin nombre'
          const menuPrecio = m.menus?.reduce((sum, menu) => sum + (menu.precio || 0), 0) || 0
          return {
            value: m.id,
            label: `[Menú] ${menuNombres} ($${menuPrecio})`,
            nombre: menuNombres,
            detalleSeccionCartaID: m.id,
          }
        })
      ]

      setItemsCarta(options)
    } catch (error) {
      console.error('Error al cargar artículos/promociones:', error)
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Código Comanda',
      render: (val) => val ? val.slice(0, 8).toUpperCase() : '-',
    },
    {
      key: 'fechaSolicitudComanda',
      label: 'Fecha Solicitud',
      render: (val) => formatearFechaHora(val),
    },
    {
      key: 'fechaEntregaComanda',
      label: 'Fecha Entrega',
      render: (val) => formatearFechaHora(val),
    },
    {
      key: 'estadoComanda',
      label: 'Estado',
      render: (val) => renderEstadoComanda(val),
    },
    {
      key: 'total',
      label: 'Total',
      render: (val) => formatearMoneda(val),
    },
    {
      key: 'facturaNumero',
      label: 'Factura Nro',
      render: (val) => val ? <CBadge color="dark">{val}</CBadge> : <span className="text-muted">Sin facturar</span>,
    },
  ]

  const accionesExtra = [
    {
      label: 'Facturar y Cerrar',
      icon: cilDollar,
      className: 'text-success',
      condition: (item) => item.estadoComanda === 'ABIERTA',
      onClick: (item) => {
        return new Promise((resolve, reject) => {
          setFacturandoConfig({ item, resolve, reject })
        })
      }
    },
    {
      label: 'Entregar Pedido',
      icon: cilTruck,
      className: 'text-primary',
      condition: (item) => item.estadoComanda === 'PENDIENTE_DE_ENTREGA',
      onClick: async (item) => {
        const res = await apiFetch(`http://localhost:9000/api/v1/comanda/${item.id}/entregar`, {
          method: 'PUT'
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al registrar la entrega')
        }
      }
    },
    {
      label: 'Entrega Fallida',
      icon: cilBan,
      className: 'text-warning',
      condition: (item) => item.estadoComanda === 'PENDIENTE_DE_ENTREGA',
      onClick: async (item) => {
        const res = await apiFetch(`http://localhost:9000/api/v1/comanda/${item.id}/entrega-fallida`, {
          method: 'PUT'
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al registrar entrega fallida')
        }
      }
    },
    {
      label: 'Anular Comanda',
      icon: cilBan,
      className: 'text-danger',
      condition: (item) => item.estadoComanda !== 'FINALIZADA' && item.estadoComanda !== 'ANULADA',
      onClick: async (item) => {
        const res = await apiFetch(`http://localhost:9000/api/v1/comanda/${item.id}/anular`, {
          method: 'PUT'
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al anular la comanda')
        }
      }
    }
  ]

  return (
    <>
      <GenericPage
        apiBase="http://localhost:9000/api/v1/comanda"
        tituloLista="Gestión de Comandas"
        columns={columns}
        tamanioPagina={10}
        deleteButtonText="Anular Comanda"
        permitirBorrar={true}
        deleteMessage={(item) => (
          <p>
            ¿Estás seguro de que deseas anular la comanda{' '}
            <strong>{(item?.id || '').slice(0, 8).toUpperCase()}</strong>?
          </p>
        )}
        cargarDetalle={async (item) => {
          const res = await apiFetch(`http://localhost:9000/api/v1/comanda/${item.id}`)
          return await res.json()
        }}
        accionesExtra={accionesExtra}
        renderForm={(props) => (
          <ComandaForm
            {...props}
            onGuardar={(payload) => {
              const entityPayload = {
                estadoComanda: payload.estadoComanda || 'ABIERTA',
                detalles: (payload.detalles || []).map((d) => {
                  const detail = {
                    cantidad: Number(d.cantidad),
                    estadoDetalleComanda: d.estadoDetalleComanda || 'EN_PROCESO_DE_SOLICITUD',
                    detalleSeccionCartaId: d.itemId || d.detalleSeccionCartaId || d.detalleSeccionCarta?.id || d.detalleSeccionCartaId
                  }
                  if (d.id) {
                    detail.id = d.id
                  }
                  return detail
                }),
              }
              props.onGuardar(entityPayload)
            }}
            itemsCarta={itemsCarta}
            formatearMoneda={formatearMoneda}
          />
        )}
      />

      <FacturarComandaModal
        visible={facturandoConfig !== null}
        comanda={facturandoConfig?.item}
        promociones={promociones}
        onCerrar={() => {
          if (facturandoConfig) {
            facturandoConfig.resolve()
            setFacturandoConfig(null)
          }
        }}
        onConfirmar={async (formaPagoId, promocionId) => {
          if (!facturandoConfig) return
          try {
            let url = `http://localhost:9000/api/v1/comanda/${facturandoConfig.item.id}/facturar?formaPagoId=${formaPagoId}`
            if (promocionId) {
              url += `&promocionId=${promocionId}`
            }
            const res = await apiFetch(url, { method: 'POST' })
            if (!res.ok) {
              const errorData = await res.json()
              alert(errorData.error || 'Error al facturar la comanda')
              facturandoConfig.reject(new Error(errorData.error || 'Error al facturar'))
            } else {
              facturandoConfig.resolve()
            }
          } catch (err) {
            facturandoConfig.reject(err)
          } finally {
            setFacturandoConfig(null)
          }
        }}
      />
    </>
  )
}

export default ComandaPage
