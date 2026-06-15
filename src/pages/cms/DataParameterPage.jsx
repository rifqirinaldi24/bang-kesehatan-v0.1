import { useState } from 'react';
import { getParameters, getParameterGroups, updateParametersBatch, resetParameters } from '../../data/parameterStore';

const GROUP_ICONS = {
  General: 'settings',
  SEO: 'search',
  Display: 'palette',
  API: 'key',
};

export default function DataParameterPage() {
  const [params, setParams] = useState(() => getParameters());
  const [successMsg, setSuccessMsg] = useState('');
  const [editedValues, setEditedValues] = useState({});

  const groups = getParameterGroups();

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleChange = (key, value) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentValue = (param) => {
    return editedValues[param.key] !== undefined ? editedValues[param.key] : param.value;
  };

  const handleSaveGroup = (group) => {
    const groupParams = params.filter(p => p.group === group);
    const updates = groupParams
      .filter(p => editedValues[p.key] !== undefined)
      .map(p => ({ key: p.key, value: editedValues[p.key] }));

    if (updates.length === 0) return;

    updateParametersBatch(updates);
    setParams(getParameters());
    // Clear edited values for this group
    const newEdited = { ...editedValues };
    groupParams.forEach(p => delete newEdited[p.key]);
    setEditedValues(newEdited);
    showSuccess(`Parameter grup "${group}" berhasil disimpan.`);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset semua parameter ke default? Semua perubahan akan hilang.')) {
      resetParameters();
      setParams(getParameters());
      setEditedValues({});
      showSuccess('Semua parameter berhasil di-reset.');
    }
  };

  const hasGroupChanges = (group) => {
    const groupParams = params.filter(p => p.group === group);
    return groupParams.some(p => editedValues[p.key] !== undefined && editedValues[p.key] !== p.value);
  };

  const renderField = (param) => {
    const value = getCurrentValue(param);

    switch (param.type) {
      case 'boolean':
        return (
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id={`param-${param.key}`}
              checked={value === 'true' || value === true}
              onChange={(e) => handleChange(param.key, String(e.target.checked))}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-border-muted appearance-none cursor-pointer z-10 transition-transform duration-200"
              style={(value === 'true' || value === true) ? { right: 0, borderColor: '#006a69' } : {}}
            />
            <label
              htmlFor={`param-${param.key}`}
              className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors"
              style={(value === 'true' || value === true) ? { backgroundColor: '#0ea5a4' } : { backgroundColor: '#e2e7ff' }}
            ></label>
          </div>
        );
      case 'color':
        return (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={value}
              onChange={(e) => handleChange(param.key, e.target.value)}
              className="w-10 h-10 rounded-lg border border-border-muted cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(param.key, e.target.value)}
              className="flex-1 px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono"
            />
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        );
      default: // text
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
            className="w-full px-4 py-2.5 bg-surface border border-border-muted rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Data Parameter</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Konfigurasi sistem yang fleksibel, siap integrasi backend</p>
        </div>
        <button onClick={handleResetAll} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-muted text-on-surface-variant rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Reset Semua
        </button>
      </div>

      {/* Info Box */}
      <div className="mb-6 bg-secondary-container/30 border border-secondary-container text-on-surface-variant p-4 rounded-xl flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary">info</span>
        <p className="font-body-sm text-sm">
          Parameter ini disimpan secara lokal (localStorage) dan berfungsi sebagai <strong>blueprint</strong> untuk integrasi backend nanti.
          Semua value yang tersimpan di sini tidak akan hardcode di source code.
        </p>
      </div>

      {/* Parameter Groups */}
      <div className="space-y-6">
        {groups.map(group => {
          const groupParams = params.filter(p => p.group === group);
          const hasChanges = hasGroupChanges(group);
          return (
            <div key={group} className="bg-surface-container-lowest border border-border-muted rounded-2xl overflow-hidden">
              {/* Group Header */}
              <div className="px-6 py-4 border-b border-border-muted bg-surface-container-low/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">{GROUP_ICONS[group] || 'settings'}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{group}</h3>
                </div>
                <button
                  onClick={() => handleSaveGroup(group)}
                  disabled={!hasChanges}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                    hasChanges
                      ? 'bg-primary text-on-primary hover:opacity-90'
                      : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan
                </button>
              </div>

              {/* Group Fields */}
              <div className="p-6 space-y-6">
                {groupParams.map(param => (
                  <div key={param.key}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label className="font-label-md text-label-md font-semibold text-on-surface" htmlFor={`param-${param.key}`}>
                        {param.label}
                      </label>
                      <span className="font-mono text-[10px] text-outline bg-surface-container px-2 py-0.5 rounded">{param.key}</span>
                    </div>
                    {param.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{param.description}</p>
                    )}
                    {renderField(param)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
