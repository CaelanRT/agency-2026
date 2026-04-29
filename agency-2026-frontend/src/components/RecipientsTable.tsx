import './RecipientsTable.css';
import type { Recipient } from '../types';

interface RecipientsTableProps {
  recipients: Recipient[];
  loading: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-CA', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  return currencyFormatter.format(value);
}

function formatPercent(value: number) {
  return percentageFormatter.format(value);
}

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="recipients-table__row">
      <td>
        <span className="recipients-table__skeleton recipients-table__skeleton--rank" />
      </td>
      <td>
        <span className="recipients-table__skeleton recipients-table__skeleton--name" />
      </td>
      <td>
        <span className="recipients-table__skeleton recipients-table__skeleton--value" />
      </td>
      <td>
        <span className="recipients-table__skeleton recipients-table__skeleton--value" />
      </td>
      <td>
        <span className="recipients-table__skeleton recipients-table__skeleton--percent" />
      </td>
    </tr>
  ));
}

export default function RecipientsTable({
  recipients,
  loading,
}: RecipientsTableProps) {
  if (!loading && recipients.length === 0) {
    return (
      <div className="recipients-table__empty" role="status">
        Select a ministry to view the top procurement recipients.
      </div>
    );
  }

  return (
    <div className="recipients-table__container">
      <table className="recipients-table">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Recipient</th>
            <th scope="col">Total Contract Spend</th>
            <th scope="col">Sole Source Spend</th>
            <th scope="col">% of Ministry Spend</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingRows />
          ) : (
            recipients.map((recipient, index) => {
              const highSoleSourceRatio =
                recipient.total_spend > 0 &&
                recipient.sole_source_spend / recipient.total_spend > 0.5;

              return (
                <tr
                  key={recipient.recipient}
                  className={`recipients-table__row${
                    highSoleSourceRatio ? ' recipients-table__row--flagged' : ''
                  }`}
                >
                  <td>{index + 1}</td>
                  <td className="recipients-table__recipient">{recipient.recipient}</td>
                  <td>{formatCurrency(recipient.total_spend)}</td>
                  <td>{formatCurrency(recipient.sole_source_spend)}</td>
                  <td>{formatPercent(recipient.share)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
