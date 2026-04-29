import { useState, useEffect } from 'react'
import MinistrySelector from './components/MinistrySelector'
import { BASE_URL } from './api'
import './App.css'

function App() {
  const [ministries, setMinistries] = useState<string[]>([])
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null)
  const [loadingMinistries, setLoadingMinistries] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/api/ministries`)
      .then((res) => res.json())
      .then((data) => setMinistries(data.ministries))
      .catch((err) => console.error('Failed to fetch ministries:', err))
      .finally(() => setLoadingMinistries(false))
  }, [])

  return (
    <>
      <header className="app-header">
        <h1>Procurement Risk Radar</h1>
        <MinistrySelector
          ministries={ministries}
          selected={selectedMinistry}
          onSelect={setSelectedMinistry}
          loading={loadingMinistries}
        />
        <span className="subtitle">Alberta Government Contract Analytics</span>
      </header>

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
            <div className="placeholder">AI-generated summary will appear here</div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default App
