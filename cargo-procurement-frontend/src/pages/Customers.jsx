import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { Empty, PageHeader } from "../components/Common";

export default function Customers() {
  const [rows, setRows] = useState([]),
    [show, setShow] = useState(false),
    [err, setErr] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    country: "Bhutan",
    taxNo: "",
  });
  const load = () =>
    api
      .get("/customers")
      .then((r) => {
        const data = r?.data?.data;
        setRows(
          Array.isArray(data) ? data : Array.isArray(r?.data) ? r.data : [],
        );
        setErr("");
      })
      .catch((e) => {
        setRows([]);
        setErr(e.response?.data?.message || "Load failed");
      });
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post("/customers", form);
      setShow(false);
      setForm({
        customerName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        country: "Bhutan",
        taxNo: "",
      });
      load();
    } catch (error) {
      setErr(error.response?.data?.message || "Save failed");
    }
  };
  const del = async (id) => {
    if (confirm("Delete this customer?")) {
      try {
        await api.delete("/customers/" + id);
        load();
      } catch (error) {
        setErr(error.response?.data?.message || "Delete failed");
      }
    }
  };
  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage import and cargo customers."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + Add Customer
      </button>
      {err && <div className="alert error">{err}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(Boolean).map((x, i) => (
              <tr key={x?._id || `row-${i}`}>
                <td>{x?.customerName || "-"}</td>
                <td>{x?.companyName || "-"}</td>
                <td>{x?.phone || "-"}</td>
                <td>{x?.email || "-"}</td>
                <td>{x?.country || "-"}</td>
                <td>
                  <button
                    className="btn danger"
                    onClick={() => x?._id && del(x._id)}
                    disabled={!x?._id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <Empty />}
      </div>
      {show && (
        <Modal title="Add Customer" onClose={() => setShow(false)}>
          <form className="grid-form" onSubmit={save}>
            {Object.keys(form).map((k) => (
              <input
                key={k}
                required={k === "customerName" || k === "phone"}
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <button className="btn primary">Save</button>
          </form>
        </Modal>
      )}
    </>
  );
}
