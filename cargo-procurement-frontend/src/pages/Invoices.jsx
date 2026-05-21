import { useEffect, useMemo, useState } from "react";
import html2pdf from "html2pdf.js";
import api from "../services/api";
import Modal from "../components/Modal";
import PaymentModal from "../components/PaymentModal";
import { Empty, PageHeader, formatMoney, getName } from "../components/Common";
import { invoiceHtml } from "../components/InvoicePdfTemplate";

export default function Invoices() {
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [procurements, setProcurements] = useState([]);

  const [show, setShow] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    shipmentId: "",
    procurementId: "",
    currency: "BTN",
    description: "Shipping Charge",
    quantity: 1,
    rate: 0,
    tax: 0,
    discount: 0,
    dueDate: "",
    note: "",
  });

  const selectedShipment = useMemo(
    () => shipments.find((s) => s._id === form.shipmentId),
    [shipments, form.shipmentId],
  );

  const load = () =>
    Promise.all([
      api.get("/invoices"),
      api.get("/customers"),
      api.get("/shipments"),
      api.get("/procurements"),
    ]).then(([a, b, c, d]) => {
      setRows(a.data.data || []);
      setCustomers(b.data.data || []);
      setShipments(c.data.data || []);
      setProcurements(d.data.data || []);
    });

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    await api.post("/invoices", {
      customerId: form.customerId,
      shipmentId: form.shipmentId || undefined,
      procurementId: form.procurementId || undefined,
      currency: form.currency,
      tax: +form.tax,
      discount: +form.discount,
      dueDate: form.dueDate || undefined,
      note: form.note,
      items: [
        {
          description: form.description,
          quantity: +form.quantity,
          rate: +form.rate,
          amount: 0,
        },
      ],
    });

    setShow(false);
    load();
  };

  const openPaymentModal = (id, paidAmount) => {
    setPaymentInvoiceId(id);
    setPaymentAmount(paidAmount || 0);
    setPaymentModal(true);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
    setPaymentInvoiceId("");
    setPaymentAmount("");
  };

  const submitPayment = async (e) => {
    e.preventDefault();

    await api.put(`/invoices/${paymentInvoiceId}/payment`, {
      paidAmount: Number(paymentAmount),
    });

    closePaymentModal();
    load();
  };

  const pdf = async (invoice) => {
    try {
      setLoadingPdf(true);

      const wrapper = document.createElement("div");
      wrapper.innerHTML = invoiceHtml(invoice);
      document.body.appendChild(wrapper);

      await html2pdf()
        .set({
          margin: 0,
          filename: `${invoice.invoiceNo || "invoice"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        })
        .from(wrapper.firstElementChild)
        .save();

      document.body.removeChild(wrapper);
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Generate invoices, update payments and download PDF."
      />

      <button className="btn primary" onClick={() => setShow(true)}>
        + New Invoice
      </button>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((x) => (
              <tr key={x._id}>
                <td>{x.invoiceNo}</td>
                <td>{getName(x, "customerId")}</td>
                <td>{formatMoney(x.grandTotal, x.currency)}</td>
                <td>{formatMoney(x.paidAmount, x.currency)}</td>
                <td>
                  <span className="badge">{x.paymentStatus}</span>
                </td>
                <td>
                  <button
                    className="btn ghost"
                    onClick={() => openPaymentModal(x._id, x.paidAmount)}
                  >
                    Payment
                  </button>

                  <button
                    className="btn ghost"
                    disabled={loadingPdf}
                    onClick={() => pdf(x)}
                  >
                    {loadingPdf ? "Generating..." : "PDF"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!rows.length && <Empty />}
      </div>

      {show && (
        <Modal title="New Invoice" onClose={() => setShow(false)}>
          <form className="grid-form" onSubmit={save}>
            <select
              required
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName || c.name}
                </option>
              ))}
            </select>

            <select
              value={form.shipmentId}
              onChange={(e) => setForm({ ...form, shipmentId: e.target.value })}
            >
              <option value="">Select shipment</option>
              {shipments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.trackingNo}
                </option>
              ))}
            </select>

            <select
              value={form.procurementId}
              onChange={(e) =>
                setForm({ ...form, procurementId: e.target.value })
              }
            >
              <option value="">Select procurement</option>
              {procurements.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.requestNo}
                </option>
              ))}
            </select>

            {selectedShipment && (
              <div className="form-note">
                Tracking No: <b>{selectedShipment.trackingNo}</b>
              </div>
            )}

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <input
              type="number"
              placeholder="Rate"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />

            <input
              type="number"
              placeholder="Tax %"
              value={form.tax}
              onChange={(e) => setForm({ ...form, tax: e.target.value })}
            />

            <input
              type="number"
              placeholder="Discount"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />

            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {["BTN", "INR", "USD", "CNY"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <textarea
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />

            <button className="btn primary">Save</button>
          </form>
        </Modal>
      )}

      <PaymentModal
        open={paymentModal}
        onClose={closePaymentModal}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        submitPayment={submitPayment}
      />
    </>
  );
}
