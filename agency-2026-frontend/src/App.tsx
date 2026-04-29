import { useEffect, useState } from 'react'
import RecipientsTable from './components/RecipientsTable'
import RiskIndicators from './components/RiskIndicators'
import MinistrySelector from './components/MinistrySelector'
import { fetchMinistries, fetchRecipients } from './api'
import type { Recipient } from './types'
import './App.css'

function App() {
  const [ministries, setMinistries] = useState<string[]>([])
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null)
  const [loadingMinistries, setLoadingMinistries] = useState(true)
  const [ministriesError, setMinistriesError] = useState<string | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [ministryTotal, setMinistryTotal] = useState(0)
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const [recipientsError, setRecipientsError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadMinistries() {
      setLoadingMinistries(true)
      setMinistriesError(null)

      try {
        const data = await fetchMinistries()

        if (!cancelled) {
          setMinistries(data)
        }
      } catch (error) {
        console.error('Failed to fetch ministries:', error)

        if (!cancelled) {
          setMinistries([])
          setMinistriesError(
            'The backend API is unavailable. Start the server on http://localhost:3001 and refresh.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingMinistries(false)
        }
      }
    }

    void loadMinistries()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedMinistry) {
      setRecipients([])
      setMinistryTotal(0)
      setLoadingRecipients(false)
      setRecipientsError(null)
      return
    }

    const ministry = selectedMinistry
    let cancelled = false

    async function loadRecipients() {
      setRecipients([])
      setMinistryTotal(0)
      setLoadingRecipients(true)
      setRecipientsError(null)

      try {
        const data = await fetchRecipients(ministry)

        if (!cancelled) {
          setRecipients(data.recipients)
          setMinistryTotal(data.ministry_total)
        }
      } catch (error) {
        console.error('Failed to fetch recipients:', error)

        if (!cancelled) {
          setRecipients([])
          setMinistryTotal(0)
          setRecipientsError(
            `Could not load recipient data for ${ministry}. Check the backend connection and try again.`
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingRecipients(false)
        }
      }
    }

    void loadRecipients()

    return () => {
      cancelled = true
    }
  }, [selectedMinistry])

  function handleSelectMinistry(ministry: string) {
    setSelectedMinistry(ministry)
    setSummary(null)
  }

  return (
    <>
      <header className="app-header">
        <h1>Procurement Risk Radar</h1>
        <MinistrySelector
          ministries={ministries}
          selected={selectedMinistry}
          onSelect={handleSelectMinistry}
          loading={loadingMinistries}
        />
        <span className="subtitle">Alberta Government Contract Analytics</span>
      </header>

      {ministriesError ? <div className="app-notice app-notice--error">{ministriesError}</div> : null}
      {recipientsError ? <div className="app-notice app-notice--error">{recipientsError}</div> : null}

      <div className="app-layout">
        <main className="main-content">
          <section className="card">
            <h2>Top Recipients</h2>
            <RecipientsTable recipients={recipients} loading={loadingRecipients} />
          </section>

          <section className="card">
            <h2>Risk Indicators</h2>
            <RiskIndicators
              recipients={recipients}
              ministryTotal={ministryTotal}
              loading={loadingRecipients}
            />
          </section>
        </main>

        <aside className="sidebar">
          <section className="card">
            <h2>AI Summary</h2>
            <div className="placeholder">
              {summary
                ? summary
                : selectedMinistry
                  ? `Summary cleared for ${selectedMinistry}. Generate a new insight after data loads.`
                  : 'AI-generated summary will appear here'}
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default App
