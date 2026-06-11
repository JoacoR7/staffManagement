import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://github.com/JoacoR7/staffManagement" target="_blank" rel="noopener noreferrer">
          APKrew
        </a>
        <span className="ms-1">team</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Computación Móvil 2026</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
