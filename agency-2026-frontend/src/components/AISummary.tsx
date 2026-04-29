import './AISummary.css';

interface AISummaryProps {
  ministry: string | null;
  onGenerate: () => void;
  summary: string | null;
  loading: boolean;
}

export default function AISummary({
  ministry,
  onGenerate,
  summary,
  loading,
}: AISummaryProps) {
  const showPrompt = !ministry;
  const showButton = Boolean(ministry) && !summary && !loading;
  const showSummary = Boolean(summary) && !loading;

  return (
    <section className="ai-summary" aria-live="polite">
      <div className="ai-summary__header">
        <div className="ai-summary__badge">AI Insight</div>
        {ministry ? <p className="ai-summary__context">{ministry}</p> : null}
      </div>

      {showPrompt ? (
        <div className="ai-summary__empty">
          Select a ministry to generate a plain-language procurement insight.
        </div>
      ) : null}

      {showButton ? (
        <div className="ai-summary__ready">
          <p className="ai-summary__description">
            Generate a concise summary of concentration risk and sole-source
            reliance for {ministry}.
          </p>
          <button className="ai-summary__button" type="button" onClick={onGenerate}>
            Generate Insight
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="ai-summary__loading" role="status">
          <span className="ai-summary__spinner" aria-hidden="true" />
          <span>Analyzing procurement data...</span>
        </div>
      ) : null}

      {showSummary ? (
        <article className="ai-summary__content">
          <p className="ai-summary__text">{summary}</p>
        </article>
      ) : null}
    </section>
  );
}
