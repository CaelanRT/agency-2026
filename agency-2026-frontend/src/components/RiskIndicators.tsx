import type { Recipient } from '../types';
import './RiskIndicators.css';

interface RiskIndicatorsProps {
  recipients: Recipient[];
  ministryTotal: number;
  loading: boolean;
}

interface IndicatorDefinition {
  label: string;
  value: number;
  helper: string;
}

const percentageFormatter = new Intl.NumberFormat('en-CA', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatPercent(value: number) {
  return percentageFormatter.format(value);
}

function getSeverityClass(value: number) {
  if (value > 0.5) {
    return 'risk-indicators__card--high';
  }

  if (value >= 0.3) {
    return 'risk-indicators__card--medium';
  }

  return 'risk-indicators__card--low';
}

function LoadingCards() {
  return Array.from({ length: 3 }, (_, index) => (
    <article key={index} className="risk-indicators__card">
      <span className="risk-indicators__skeleton risk-indicators__skeleton--label" />
      <span className="risk-indicators__skeleton risk-indicators__skeleton--value" />
      <span className="risk-indicators__skeleton risk-indicators__skeleton--helper" />
    </article>
  ));
}

export default function RiskIndicators({
  recipients,
  ministryTotal,
  loading,
}: RiskIndicatorsProps) {
  if (!loading && (recipients.length === 0 || ministryTotal <= 0)) {
    return (
      <div className="risk-indicators__empty" role="status">
        Select a ministry to surface procurement concentration and sole-source risk.
      </div>
    );
  }

  const topVendorShare = recipients[0]?.share ?? 0;
  const top3Share = recipients
    .slice(0, 3)
    .reduce((sum, recipient) => sum + recipient.share, 0);
  const totalSoleSourceShare =
    ministryTotal > 0
      ? recipients.reduce((sum, recipient) => sum + recipient.sole_source_spend, 0) /
        ministryTotal
      : 0;

  const indicators: IndicatorDefinition[] = [
    {
      label: 'Top vendor share',
      value: topVendorShare,
      helper: 'Largest recipient as a share of ministry spend',
    },
    {
      label: 'Top 3 vendor share',
      value: top3Share,
      helper: 'Combined concentration across the three largest recipients',
    },
    {
      label: 'Sole-source proportion',
      value: totalSoleSourceShare,
      helper: 'Sole-source dollars divided by total ministry spend',
    },
  ];

  return (
    <div className="risk-indicators">
      {loading ? (
        <LoadingCards />
      ) : (
        indicators.map((indicator) => (
          <article
            key={indicator.label}
            className={`risk-indicators__card ${getSeverityClass(indicator.value)}`}
          >
            <p className="risk-indicators__label">{indicator.label}</p>
            <p className="risk-indicators__value">{formatPercent(indicator.value)}</p>
            <p className="risk-indicators__helper">{indicator.helper}</p>
          </article>
        ))
      )}
    </div>
  );
}
