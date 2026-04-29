import { useState } from 'react';
import type { MinistryRiskItem } from '../types';
import './RiskWatchlist.css';

interface RiskWatchlistProps {
  items: MinistryRiskItem[];
  loading: boolean;
  onSelectMinistry: (ministry: string) => void;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  return `$${Math.round(value).toLocaleString()}`;
}

function getPrimarySignal(item: MinistryRiskItem) {
  const candidates = [
    {
      label: 'Top vendor share',
      value: item.top_vendor_share,
      formatted: formatPercent(item.top_vendor_share),
    },
    {
      label: 'Top 3 share',
      value: item.top_3_share,
      formatted: formatPercent(item.top_3_share),
    },
    {
      label: 'Sole-source share',
      value: item.sole_source_share,
      formatted: formatPercent(item.sole_source_share),
    },
  ];

  return candidates.sort((left, right) => right.value - left.value)[0];
}

function LoadingCards() {
  return Array.from({ length: 3 }, (_, index) => (
    <article key={index} className="risk-watchlist__item risk-watchlist__item--loading">
      <span className="risk-watchlist__skeleton risk-watchlist__skeleton--eyebrow" />
      <span className="risk-watchlist__skeleton risk-watchlist__skeleton--title" />
      <span className="risk-watchlist__skeleton risk-watchlist__skeleton--metric" />
      <span className="risk-watchlist__skeleton risk-watchlist__skeleton--detail" />
    </article>
  ));
}

export default function RiskWatchlist({
  items,
  loading,
  onSelectMinistry,
}: RiskWatchlistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const watchlist = items.slice(0, 5);

  return (
    <section className={`risk-watchlist${isOpen ? ' risk-watchlist--open' : ''}`}>
      <button
        className="risk-watchlist__toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <div className="risk-watchlist__header">
          <div>
            <p className="risk-watchlist__eyebrow">AI Watchlist</p>
            <h3>Start where the data looks riskiest</h3>
          </div>
        </div>
        <span className={`risk-watchlist__chevron${isOpen ? ' risk-watchlist__chevron--open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <div className="risk-watchlist__content">
          {!loading && watchlist.length === 0 ? (
            <div className="risk-watchlist__empty" role="status">
              The proactive risk watchlist will appear here once the ministry scan is wired in.
            </div>
          ) : (
            <div className="risk-watchlist__list">
              {loading ? (
                <LoadingCards />
              ) : (
                watchlist.map((item, index) => {
                  const primarySignal = getPrimarySignal(item);

                  return (
                    <article key={item.ministry} className="risk-watchlist__item">
                      <div className="risk-watchlist__item-topline">
                        <span className="risk-watchlist__rank">#{index + 1}</span>
                        <span className="risk-watchlist__score">
                          Risk score {item.risk_score.toFixed(2)}
                        </span>
                      </div>

                      <div className="risk-watchlist__body">
                        <h4>{item.ministry}</h4>
                        <p className="risk-watchlist__signal">
                          Primary alert: {primarySignal.label} at {primarySignal.formatted}
                        </p>
                        <p className="risk-watchlist__detail">
                          Total observed spend {formatCurrency(item.total_spend)}
                        </p>
                      </div>

                      <button
                        className="risk-watchlist__action"
                        type="button"
                        onClick={() => onSelectMinistry(item.ministry)}
                      >
                        View ministry
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
