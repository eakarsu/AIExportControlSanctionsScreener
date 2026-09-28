import React from 'react';

export default function AIScenarioButtons({ samples, onSelect }) {
  return (
    <div className="ai-samples">
      <div className="ai-samples-label">Load Sample Data:</div>
      <div className="ai-samples-grid">
        {samples.map((sample, index) => (
          <button key={sample.name} type="button" className="sample-btn" onClick={() => onSelect(sample)}>
            <span className="sample-btn-icon">S{index + 1}</span>
            <span className="sample-btn-text">
              <strong>{sample.name}</strong>
              <small>{sample.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
