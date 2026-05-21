import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { Empty, PageHeader } from "../components/Common";

export default function Suppliers() {
  const [rows, setRows] = useState([]),
    [show, setShow] = useState(false),
    [err, setErr] = useState("");
  const [form, setForm] = useState({
    supplierName: "",
    companyName: "",
    email: "",
    phone: "",
    country: "India",
    address: "",
    productCategories: "",
    paymentTerms: "",
  });
  const load = () =>
    api
      .get("/suppliers")
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
      await api.post("/suppliers", {
        ...form,
        productCategories: form.productCategories
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      });
      setShow(false);
      load();
    } catch (error) {
      setErr(error.response?.data?.message || "Save failed");
    }
  };
  return (
    <>
      <PageHeader
        title="Suppliers"
        subtitle="Manage product suppliers and procurement partners."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + Add Supplier
      </button>
      {err && <div className="alert error">{err}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(Boolean).map((x, i) => (
              <tr key={x?._id || `row-${i}`}>
                <td>{x?.supplierName || "-"}</td>
                <td>{x?.companyName || "-"}</td>
                <td>{x?.phone || "-"}</td>
                <td>{x?.country || "-"}</td>
                <td>
                  {Array.isArray(x?.productCategories)
                    ? x.productCategories.join(", ")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <Empty />}
      </div>
      {show && (
        <Modal title="Add Supplier" onClose={() => setShow(false)}>
          <form className="grid-form" onSubmit={save}>
            {Object.keys(form).map((k) => (
              <input
                key={k}
                required={["supplierName", "phone", "country"].includes(k)}
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
