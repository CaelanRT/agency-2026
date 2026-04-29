import './App.css'

function App() {
  return (
    <>
      <header className="app-header">
        <h1>Procurement Risk Radar</h1>
        <span className="subtitle">Alberta Government Contract Analytics</span>
      </header>

      <div className="app-layout">
        <main className="main-content">
          <section className="card">
            <h2>Ministry Selector</h2>
            <div className="placeholder">Select a ministry to view procurement data</div>
          </section>

          <section className="card">
            <h2>Top Recipients</h2>
            <div className="placeholder">Recipients will appear here</div>
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
