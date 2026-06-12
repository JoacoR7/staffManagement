import React, { useEffect, useState } from 'react'
import GenericPage from '../../components/generic/GenericPage'
import { useApi } from '@/hooks/useApi'
import { API_URL } from '@/config'
import { CBadge } from '@coreui/react'
import { cilDollar, cilBan } from '@coreui/icons'
import ComandaForm from './ComandaForm'
import FacturarComandaModal from './FacturarComandaModal'

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
  const [clientes, setClientes] = useState([])
  const [promociones, setPromociones] = useState([])
  const [facturandoConfig, setFacturandoConfig] = useState(null)

  const cargarCartaYPromos = async () => {
    const results = await Promise.allSettled([
      apiFetch(`${API_URL}/api/v1/carta/activa`),
      apiFetch(`${API_URL}/api/v1/cliente`),
      apiFetch(`${API_URL}/api/v1/promocion`),
    ])

    const [resCarta, resClientes, resPromociones] = results.map((r) =>
      r.status === 'fulfilled' ? r.value : null,
    )

    if (resClientes && resClientes.ok) {
      const data = await resClientes.json()
      const lista = Array.isArray(data) ? data : data.content || []
      setClientes(lista.map((c) => ({ value: c.id, label: `${c.nombre} ${c.apellido}` })))
    }

    if (resPromociones && resPromociones.ok) {
      const data = await resPromociones.json()
      const promosList = Array.isArray(data) ? data : data.content || []
      setPromociones(
        promosList.map((p) => ({
          value: p.id,
          label: `${p.descripcion} (${p.porcentajeDescuento}%)`,
        })),
      )
    }

    if (resCarta && resCarta.ok) {
      const cartaData = await resCarta.json()
      const categorias = cartaData.categorias || []

      const options = []
      for (const cat of categorias) {
        for (const p of cat.productos || []) {
          options.push({
            value: p.detalleSeccionCartaId,
            label: `[${cat.nombre}] ${p.nombre} ($${p.precio})`,
            nombre: p.nombre,
            detalleSeccionCartaID: p.detalleSeccionCartaId,
          })
        }
        for (const m of cat.menus || []) {
          options.push({
            value: m.detalleSeccionCartaId,
            label: `[${cat.nombre}] ${m.nombre} ($${m.precio})`,
            nombre: m.nombre,
            detalleSeccionCartaID: m.detalleSeccionCartaId,
          })
        }
      }

      setItemsCarta(options)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarCartaYPromos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      key: 'id',
      label: 'Código Comanda',
      render: (val) => (val ? val.slice(0, 8).toUpperCase() : '-'),
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
      render: (val) =>
        val ? (
          <CBadge color="dark">{val}</CBadge>
        ) : (
          <span className="text-muted">Sin facturar</span>
        ),
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
      },
    },
    {
      label: 'Anular Comanda',
      icon: cilBan,
      className: 'text-danger',
      condition: (item) => item.estadoComanda !== 'FINALIZADA' && item.estadoComanda !== 'ANULADA',
      onClick: async (item) => {
        const res = await apiFetch(`${API_URL}/api/v1/comanda/${item.id}/anular`, {
          method: 'PUT',
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Error al anular la comanda')
        }
      },
    },
  ]

  return (
    <>
      <GenericPage
        apiBase={`${API_URL}/api/v1/comanda`}
        tituloLista="Gestión de Comandas"
        columns={columns}
        tamanioPagina={10}
        deleteButtonText="Anular Comanda"
        permitirBorrar={false}
        deleteMessage={(item) => (
          <p>
            ¿Estás seguro de que deseas anular la comanda{' '}
            <strong>{(item?.id || '').slice(0, 8).toUpperCase()}</strong>?
          </p>
        )}
        cargarDetalle={async (item) => {
          const res = await apiFetch(`${API_URL}/api/v1/comanda/${item.id}`)
          return await res.json()
        }}
        accionesExtra={accionesExtra}
        renderForm={(props) => (
          <ComandaForm
            {...props}
            clientes={clientes}
            onGuardar={(payload) => {
              const entityPayload = {
                cliente: { id: payload.clienteId },
                estadoComanda: payload.estadoComanda || 'ABIERTA',
                detalles: (payload.detalles || []).map((d) => {
                  const detail = {
                    cantidad: Number(d.cantidad),
                    subtotal: 0,
                    estadoDetalleComanda: d.estadoDetalleComanda || 'EN_PROCESO_DE_SOLICITUD',
                    detalleSeccionCartaId:
                      d.itemId ||
                      d.detalleSeccionCartaId ||
                      d.detalleSeccionCarta?.id ||
                      d.detalleSeccionCartaId,
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
            let url = `${API_URL}/api/v1/comanda/${facturandoConfig.item.id}/facturar?formaPagoId=${formaPagoId}`
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
