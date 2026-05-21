import Modal from "./Modal";

export default function PaymentModal({
  open,
  onClose,
  paymentAmount,
  setPaymentAmount,
  submitPayment,
}) {
  if (!open) return null;

  return (
    <Modal title="Update Payment" onClose={onClose}>
      <form className="grid-form" onSubmit={submitPayment}>
        <input
          type="number"
          placeholder="Enter payment amount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          required
        />

        <button className="btn primary">Save Payment</button>
      </form>
    </Modal>
  );
}
