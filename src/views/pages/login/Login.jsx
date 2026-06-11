import React, { useState } from 'react'
import { useAuth } from 'src/context/AuthContext'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { logo } from 'src/assets/brand/logo'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error(err.message)
      alert('Login fallido')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8}>
            <CCardGroup className="shadow">

              {/* LOGIN */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">
                      Ingrese a su cuenta
                    </p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="ejemplo@email.com"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CButton color="primary" className="w-100" type="submit">
                      Ingresar
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* BRAND (RESPONSIVE Y SIN DESBORDES) */}
              <CCard className="text-white bg-primary d-none d-md-flex overflow-hidden">
                <CCardBody className="d-flex align-items-center justify-content-center text-center p-4">
                  <CIcon
                    icon={logo}
                    style={{
                      width: '100%',
                      maxWidth: 280,
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login