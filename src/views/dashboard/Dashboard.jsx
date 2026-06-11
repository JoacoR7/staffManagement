import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'

import { API_URL } from '@/config'

import { useApi } from '../../hooks/useApi'

const Dashboard = () => {
  const { apiFetch } = useApi()

  const [stats, setStats] = useState({
    clientes: 0,
    empleados: 0,
    stockCritico: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {

      
      const response = await apiFetch(
        `${API_URL}/api/v1/dashboard`
      )

      const data = await response.json()

      setStats(data)
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <CRow>
      <CCol md={3}>
        <CCard>
          <CCardBody>
            <h6>Clientes</h6>
            <h2>{stats.clientes}</h2>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol md={3}>
        <CCard>
          <CCardBody>
            <h6>Empleados</h6>
            <h2>{stats.empleados}</h2>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol md={3}>
        <CCard>
          <CCardBody>
            <h6>Stock Crítico</h6>
            <h2>{stats.stockCritico}</h2>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard