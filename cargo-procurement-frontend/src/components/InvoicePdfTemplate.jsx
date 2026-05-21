const COMPANY = {
  name: "Tashi Palbar Enterprise",
  address: [
    "Chhukha Phuntsholing",
    "Pekarshing(Toribari)",
    "Pekarzhing/Toribari",
    "Bhutan",
  ],
  taxPayerNo: "TAB79046",
  licenseNo: "R2004324",
  account: "203194314",
  logoText: "T",
};

const currencySymbol = (currency = "BTN") => {
  const symbols = { BTN: "Nu. ", INR: "₹", USD: "$", CNY: "¥" };
  return symbols[currency] || `${currency} `;
};

const money = (value = 0, currency = "BTN") =>
  `${currencySymbol(currency)}${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const customerName = (invoice) =>
  invoice?.customerId?.customerName ||
  invoice?.customerId?.name ||
  invoice?.customerName ||
  "Customer";

const customerAddress = (invoice) => {
  const c = invoice?.customerId || {};
  return [c.address, c.city, c.country].filter(Boolean);
};

export const invoiceHtml = (invoice) => {
  const items = invoice.items?.length
    ? invoice.items
    : [{ description: "Shipping Charge", quantity: 1, rate: invoice.grandTotal || 0 }];

  const subtotal =
    invoice.subtotal ??
    items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.rate || 0), 0);

  const tax = Number(invoice.tax || 0);
  const discount = Number(invoice.discount || 0);
  const taxAmount = tax > 0 && tax < 100 ? (subtotal * tax) / 100 : tax;
  const total = invoice.grandTotal ?? subtotal + taxAmount - discount;
  const paid = Number(invoice.paidAmount || 0);
  const balance = Math.max(total - paid, 0);
  const currency = invoice.currency || "BTN";
  const billAddress = customerAddress(invoice);

  return `
    <div style="width:794px; min-height:1123px; padding:54px 58px; box-sizing:border-box; font-family:Arial, Helvetica, sans-serif; color:#555; background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div style="width:70px; height:70px; border-radius:50%; background:#a94b00; color:#fff; display:flex; align-items:center; justify-content:center; font-size:44px; font-weight:700; margin-bottom:18px;">
            ${COMPANY.logoText}
          </div>
          <div style="font-size:14px; font-weight:700; color:#a94b00; margin-bottom:6px;">${COMPANY.name}</div>
          ${COMPANY.address.map((line) => `<div style="font-size:12px; line-height:1.55;">${line}</div>`).join("")}
          <div style="margin-top:12px; font-size:12px; line-height:1.7;">
            <div><span style="font-weight:700;">TPN:</span> ${COMPANY.taxPayerNo}</div>
            <div><span style="font-weight:700;">License No:</span> ${COMPANY.licenseNo}</div>
            <div><span style="font-weight:700;">Account No:</span> ${COMPANY.account}</div>
          </div>
        </div>

        <div style="text-align:right; padding-top:20px;">
          <div style="font-size:30px; letter-spacing:1px; color:#a94b00; font-weight:500;">INVOICE</div>
          <div style="font-size:12px; color:#111; font-weight:700; margin-top:4px;"># ${invoice.invoiceNo || "INV-000001"}</div>
          <div style="margin-top:52px; font-size:12px;">Balance Due</div>
          <div style="font-size:18px; color:#111; font-weight:700; margin-top:4px;">${money(balance, currency)}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:44px;">
        <div style="width:48%;">
          <div style="font-size:12px; font-weight:700; color:#333; margin-bottom:7px;">Bill To</div>
          <div style="font-size:15px; font-weight:700; color:#a94b00; margin-bottom:4px;">${customerName(invoice)}</div>
          ${billAddress.length ? billAddress.map((line) => `<div style="font-size:12px; line-height:1.55;">${line}</div>`).join("") : `<div style="font-size:12px; line-height:1.55;">Customer address</div>`}

          <div style="font-size:12px; font-weight:700; color:#333; margin:28px 0 7px;">Ship To</div>
          ${billAddress.length ? billAddress.map((line) => `<div style="font-size:12px; line-height:1.55;">${line}</div>`).join("") : `<div style="font-size:12px; line-height:1.55;">Shipping address</div>`}
        </div>

        <div style="width:38%; font-size:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span style="font-weight:700;">Invoice Date:</span><span>${formatDate(invoice.createdAt || invoice.invoiceDate)}</span></div>
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span style="font-weight:700;">Due Date:</span><span>${formatDate(invoice.dueDate)}</span></div>
          <div style="display:flex; justify-content:space-between;"><span style="font-weight:700;">Terms:</span><span>${invoice.terms || "Due on Receipt"}</span></div>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-top:28px; font-size:12px;">
        <thead>
          <tr style="background:#a33b00; color:#fff;">
            <th style="width:7%; text-align:center; padding:12px 8px;">#</th>
            <th style="text-align:left; padding:12px 8px;">Item & Description</th>
            <th style="width:13%; text-align:right; padding:12px 8px;">Qty</th>
            <th style="width:15%; text-align:right; padding:12px 8px;">Rate</th>
            <th style="width:16%; text-align:right; padding:12px 8px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => {
            const amount = item.amount || Number(item.quantity || 0) * Number(item.rate || 0);
            return `
              <tr style="border-bottom:1px solid #ddd; vertical-align:top;">
                <td style="text-align:center; padding:18px 8px; color:#333;">${index + 1}</td>
                <td style="padding:18px 8px; color:#333; font-weight:600;">
                  ${item.description || "Service Charge"}
                  ${item.note ? `<div style="font-weight:400; color:#777; margin-top:4px; font-size:11px;">${item.note}</div>` : ""}
                </td>
                <td style="text-align:right; padding:18px 8px;">${Number(item.quantity || 0).toFixed(2)}</td>
                <td style="text-align:right; padding:18px 8px;">${Number(item.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="text-align:right; padding:18px 8px;">${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; margin-top:32px;">
        <div style="width:45%; font-size:12px; line-height:1.6;">
          <div style="font-weight:700; margin-bottom:5px;">Notes</div>
          <div>${invoice.note || "Thanks for your business."}</div>
        </div>

        <div style="width:38%; font-size:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span>Sub Total</span><span>${money(subtotal, currency)}</span></div>
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span>Tax Rate</span><span>${tax}%</span></div>
          ${discount > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span>Discount</span><span>${money(discount, currency)}</span></div>` : ""}
          <div style="display:flex; justify-content:space-between; font-weight:700; color:#111; margin:18px 0;"><span>Total</span><span>${money(total, currency)}</span></div>
          <div style="display:flex; justify-content:space-between; background:#a33b00; color:#fff; font-weight:700; padding:16px 18px; font-size:14px;"><span>Balance Due</span><span>${money(balance, currency)}</span></div>
        </div>
      </div>

      <div style="margin-top:52px; font-size:11px; line-height:1.5;">
        <div style="font-weight:700; color:#333; margin-bottom:4px;">Terms & Conditions</div>
        <div>All payments must be made in full before the commencement of any work.</div>
      </div>
    </div>`;
};
