import { useState } from 'react';
import { EMISSION_FACTORS, calculateCO2, isAbsurd, getUnit } from '../utils/co2.js';
import { createActivity } from '../services/api.js';
import { toInputDate } from '../utils/week.js';

const ACTIVITY_TYPES = Object.entries(EMISSION_FACTORS).map(([key, val]) => ({
  key,
  label: val.label,
  unit: val.unit,
  factor: val.factor,
}));

export default function ActivityForm({ onSuccess }) {
  const [form, setForm] = useState({
    type: 'car',
    quantity: '',
    date: toInputDate(),
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const currentType = EMISSION_FACTORS[form.type];
  const qty = parseFloat(form.quantity);
  const previewCO2 = form.quantity ? calculateCO2(form.type, qty) : null;
  const absurd = form.quantity ? isAbsurd(form.type, qty) : false;
  const unit = getUnit(form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantity || qty <= 0) {
      setError('Please enter a valid quantity greater than 0.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await createActivity({
        type: form.type,
        quantity: qty,
        date: form.date,
        note: form.note,
      });

      const saved = res.data.data;
      setSuccessMsg(
        `✓ Logged! ${currentType.label} — ${saved.co2.toFixed(3)} kg CO₂ added.`
      );
      setForm({ type: form.type, quantity: '', date: toInputDate(), note: '' });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="activity-form" noValidate>
      {/* Activity Type */}
      <div className="form-group">
        <label className="form-label" htmlFor="activity-type">Activity Type</label>
        <select
          id="activity-type"
          name="type"
          className="form-control"
          value={form.type}
          onChange={handleChange}
        >
          {ACTIVITY_TYPES.map((a) => (
            <option key={a.key} value={a.key}>
              {a.label} — {a.factor} kg CO₂ / {a.unit}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity + Date row */}
      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="activity-quantity">
            Quantity ({unit})
          </label>
          <input
            id="activity-quantity"
            name="quantity"
            type="number"
            min="0.001"
            step="any"
            className={`form-control${absurd ? ' warning-border' : ''}`}
            placeholder={`e.g. ${unit === 'km' ? '50' : unit === 'kWh' ? '30' : '2'}`}
            value={form.quantity}
            onChange={handleChange}
            required
            aria-describedby={absurd ? 'absurd-warning' : undefined}
          />

          {/* DP2 — Absurd input inline warning */}
          {absurd && (
            <div className="inline-warning" id="absurd-warning" role="alert">
              ⚠️ Unusually large value — please double-check before saving.
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="activity-date">Date</label>
          <input
            id="activity-date"
            name="date"
            type="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            max={toInputDate()}
          />
        </div>
      </div>

      {/* CO₂ Preview */}
      {previewCO2 !== null && (
        <div className="co2-preview mt-4 animate-in" id="co2-preview">
          <div className="co2-preview-label">Estimated Emission</div>
          <div className="co2-preview-value">
            {previewCO2.toFixed(3)}
            <span className="co2-preview-unit"> kg CO₂</span>
          </div>
        </div>
      )}

      {/* Note */}
      <div className="form-group mt-4">
        <label className="form-label" htmlFor="activity-note">Note (optional)</label>
        <input
          id="activity-note"
          name="note"
          type="text"
          className="form-control"
          placeholder="e.g. Commute to office"
          value={form.note}
          onChange={handleChange}
          maxLength={200}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger mt-4" role="alert" id="form-error">
          <span className="alert-icon">❌</span>
          <div>{error}</div>
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div className="alert alert-info mt-4 animate-in" role="status" id="form-success">
          <span className="alert-icon">🌿</span>
          <div>{successMsg}</div>
        </div>
      )}

      <button
        id="submit-activity-btn"
        type="submit"
        className="btn btn-primary mt-4"
        style={{ width: '100%', padding: 'var(--sp-4)' }}
        disabled={submitting}
      >
        {submitting ? 'Saving…' : '🌱 Log Activity'}
      </button>
    </form>
  );
}
