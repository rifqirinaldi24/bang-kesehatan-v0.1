export function exportToCSV(filename, data, columns) {
  if (!data || !data.length) return;

  const header = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row => {
    return columns.map(c => {
      let val = row[c.key];
      // Handle custom getter
      if (c.getValue) val = c.getValue(row);
      
      // Escape quotes
      if (typeof val === 'string') {
        val = val.replace(/"/g, '""');
      }
      return `"${val || ''}"`;
    }).join(',');
  });

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToTXT(filename, data, columns) {
  if (!data || !data.length) return;

  const lines = data.map(row => {
    return columns.map(c => {
      let val = row[c.key];
      if (c.getValue) val = c.getValue(row);
      return `${c.label}: ${val || '-'}`;
    }).join(' | ');
  });

  const txt = lines.join('\n\n');
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// For Excel, we simply export a CSV but change the extension or rely on Excel opening CSV.
// Alternatively, we can export HTML Table as XLS which works well in older Excel versions.
// We'll just export CSV format with a .csv extension for "Excel", as Excel opens it natively.
// Or we can create an actual .xls file via HTML table format.
export function exportToExcel(filename, data, columns) {
  if (!data || !data.length) return;

  let html = '<table><thead><tr>';
  columns.forEach(c => {
    html += `<th>${c.label}</th>`;
  });
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    columns.forEach(c => {
      let val = row[c.key];
      if (c.getValue) val = c.getValue(row);
      html += `<td>${val || ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
