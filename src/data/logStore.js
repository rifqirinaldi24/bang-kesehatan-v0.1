// ============================================================
// logStore.js — Log Process Management (localStorage)
// ============================================================

const STORAGE_KEY = 'senadee_log_process';

// Generate unique log ID
function generateLogId() {
  return 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function initializeLogs() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getLogs() {
  return initializeLogs().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Add a new log entry
 * @param {Object} params
 * @param {string} params.action - e.g., 'Publish', 'Schedule', 'Save Draft'
 * @param {string} params.articleTitle
 * @param {string} params.actor - User name who performed the action
 * @param {string} params.status - 'Success' or 'Failed'
 * @param {string} [params.reason] - Reason if failed
 */
export function addLog({ action, articleTitle, actor, status, reason = '' }) {
  const logs = initializeLogs();
  const newLog = {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    action,
    articleTitle,
    actor,
    status,
    reason
  };
  logs.push(newLog);
  saveLogs(logs);
  return newLog;
}

export function clearLogs() {
  saveLogs([]);
  return [];
}
