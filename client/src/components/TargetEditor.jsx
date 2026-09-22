import { useState } from 'react';
import { useTarget } from '../hooks/useTarget';

/**
 * TargetEditor — inline editable weekly CO₂ target.
 * Default is 20 kg. User can change at any time.
 */
export default function TargetEditor({ onTargetSaved }) {
  const { target, loading, saving, saveTarget } = useTarget();
  const [value, setValue] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const displayTarget = editing ? value : (loading ? '—' : target);

  const handleEdit = () => {
    setValue(String(target));
    setEditing(true);
    setSaved(false);
  };

  const handleSave = async () => {
    const num = parseFloat(value);
    if (!num || num <= 0) return;
    const ok = await saveTarget(num);
    if (ok) {
      setEditing(false);
      setSaved(true);
      onTargetSaved?.();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div className="card animate-in" id="target-editor-card">
      <div className="card-title">Weekly Target</div>
      <p className="text-muted text-sm mb-4">
        Set your personal weekly CO₂ goal. We'll track your progress throughout the week.
      </p>

      <div className="target-editor">
        {editing ? (
          <>
            <div className="target-input-wrap">
              <input
                id="target-input"
                type="number"
                min="0.1"
                step="0.5"
                className="target-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                aria-label="Weekly CO2 target in kg"
              />
              <span className="target-unit">kg CO₂ / week</span>
            </div>
            <button
              id="target-save-btn"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="target-input-wrap" style={{ cursor: 'pointer' }} onClick={handleEdit}>
              <span className="target-input" style={{ display: 'flex', alignItems: 'center' }}>
                {displayTarget}
              </span>
              <span className="target-unit">kg CO₂ / week</span>
            </div>
            <button id="target-edit-btn" className="btn btn-ghost btn-sm" onClick={handleEdit}>
              ✏️ Edit
            </button>
            {saved && <span className="target-saved-msg">✓ Saved!</span>}
          </>
        )}
      </div>
    </div>
  );
}
