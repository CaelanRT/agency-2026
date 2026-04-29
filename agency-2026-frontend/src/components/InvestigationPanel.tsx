import { useState } from 'react';
import type { InvestigationResult } from '../types';
import './InvestigationPanel.css';

interface InvestigationPanelProps {
  query: string;
  loading: boolean;
  result: InvestigationResult | null;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  onUsePrompt: (prompt: string) => void;
}

const CANNED_PROMPTS = [
  'Which ministry looks riskiest overall?',
  'Compare Health and Education.',
  'Why does Education look risky?',
  'Which ministry has the highest sole-source reliance?',
];

export default function InvestigationPanel({
  query,
  loading,
  result,
  onQueryChange,
  onSubmit,
  onUsePrompt,
}: InvestigationPanelProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    onSubmit();
  }

  function handleUsePrompt(prompt: string) {
    setHasSubmitted(true);
    onUsePrompt(prompt);
  }

  return (
    <section className={`investigation-panel${isOpen ? ' investigation-panel--open' : ''}`} aria-live="polite">
      <button
        className="investigation-panel__toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <div className="investigation-panel__intro">
          <div>
            <p className="investigation-panel__eyebrow">Investigation Copilot</p>
            <h3>Ask the app to investigate procurement risk</h3>
          </div>
        </div>
        <span className={`investigation-panel__chevron${isOpen ? ' investigation-panel__chevron--open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <div className="investigation-panel__content">
          <form className="investigation-panel__composer" onSubmit={handleSubmit}>
            <label className="investigation-panel__label" htmlFor="investigation-query">
              Investigation prompt
            </label>
            <textarea
              id="investigation-query"
              className="investigation-panel__textarea"
              rows={4}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Which ministry looks riskiest overall?"
              disabled={loading}
            />
            <div className="investigation-panel__actions">
              <button
                className="investigation-panel__submit"
                type="submit"
                disabled={loading || query.trim().length === 0}
              >
                {loading ? 'Investigating...' : 'Run Investigation'}
              </button>
            </div>
          </form>

          <div className="investigation-panel__prompts">
            <p className="investigation-panel__label">Try one of these prompts</p>
            <div className="investigation-panel__prompt-list">
              {CANNED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="investigation-panel__prompt-chip"
                  type="button"
                  onClick={() => handleUsePrompt(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="investigation-panel__loading" role="status">
              <span className="investigation-panel__spinner" aria-hidden="true" />
              <span>Reviewing procurement patterns across the dataset...</span>
            </div>
          ) : null}

          {!loading && result ? (
            <div className="investigation-panel__result">
              <section className="investigation-panel__section investigation-panel__section--answer">
                <p className="investigation-panel__section-label">Answer</p>
                <p className="investigation-panel__answer">{result.answer}</p>
              </section>

              <div className="investigation-panel__grid">
                <section className="investigation-panel__section">
                  <p className="investigation-panel__section-label">Evidence</p>
                  <ul className="investigation-panel__list">
                    {result.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="investigation-panel__section">
                  <p className="investigation-panel__section-label">Steps Taken</p>
                  <ul className="investigation-panel__list">
                    {result.steps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="investigation-panel__section">
                  <p className="investigation-panel__section-label">Recommended Next Steps</p>
                  <ul className="investigation-panel__list">
                    {result.next_steps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          ) : null}

          {!loading && !result ? (
            <div className="investigation-panel__empty">
              {hasSubmitted
                ? 'No investigation result returned yet.'
                : 'Pick a prompt or write your own question to begin an investigation.'}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
