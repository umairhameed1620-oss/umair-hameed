import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = "pk_test_bGl0ZXJhdGUtc3RhcmxpbmctNDcuY2xlcmsuYWNjb3VudHMuZGV2JA"

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>

      <SignedOut>
        <div style={{
          minHeight: '100vh',
          background: '#0f1117',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#e2e8f0',
            marginBottom: 8,
            letterSpacing: -1
          }}>
            🛒 AisleMart
          </div>
          <div style={{
            fontSize: 13,
            color: '#64748b',
            marginBottom: 16
          }}>
            Owner Dashboard — Sign in to continue
          </div>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <App />
      </SignedIn>

    </ClerkProvider>
  </React.StrictMode>
)
