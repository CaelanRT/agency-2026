import { useEffect, useState } from 'react'
import MinistrySelector from './components/MinistrySelector'
import { fetchMinistries } from './api'
import './App.css'

function App() {
  const [ministries, setMinistries] = useState<string[]>([])
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null)
  const [loadingMinistries, setLoadingMinistries] = useState(true)
  const [ministriesError, setMinistriesError] = useState<string | null>(null)
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

      <div className="app-layout">
        <main className="main-content">
          <section className="card">
            <h2>Top Recipients</h2>
            <div className="placeholder">
              {selectedMinistry
                ? `Loading data for ${selectedMinistry}...`
                : 'Select a ministry to view procurement data'}
            </div>
          </section>

          <section className="card">
            <h2>Risk Indicators</h2>
            <div className="placeholder">Risk analysis will appear here</div>
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
