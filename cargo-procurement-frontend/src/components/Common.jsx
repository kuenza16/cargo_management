export function PageHeader({ title, subtitle }) {
  return <div className="page-head"><div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}

export function Alert({ message, type = 'error' }) {
  if (!message) return null;
  return <div className={`alert ${type}`}>{message}</div>;
}

export function Empty({ text = 'No records found.' }) {
  return <div className="empty">{text}</div>;
}

export function formatMoney(value, currency = 'BTN') {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

export function getName(item, key, fallback = '-') {
  const value = item?.[key];
  if (!value) return fallback;
  return value.customerName || value.supplierName || value.requestNo || value.trackingNo || value.invoiceNo || fallback;
}
