export default function FilterBar({ dateRange, onDateChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Desde</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={e => onDateChange({ ...dateRange, from: e.target.value })}
        />
      </div>
      <div className="filter-group">
        <label>Hasta</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={e => onDateChange({ ...dateRange, to: e.target.value })}
        />
      </div>
      {(dateRange.from || dateRange.to) && (
        <button
          className="clear-btn"
          onClick={() => onDateChange({ from: '', to: '' })}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
