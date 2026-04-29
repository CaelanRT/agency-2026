import "./MinistrySelector.css";

interface MinistrySelectorProps {
  ministries: string[];
  selected: string | null;
  onSelect: (ministry: string) => void;
  loading: boolean;
}

export default function MinistrySelector({
  ministries,
  selected,
  onSelect,
  loading,
}: MinistrySelectorProps) {
  return (
    <select
      className="ministry-selector"
      value={selected ?? ""}
      onChange={(e) => onSelect(e.target.value)}
      disabled={loading}
    >
      <option value="" disabled>
        {loading ? "Loading ministries..." : "Select a ministry..."}
      </option>
      {ministries.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
