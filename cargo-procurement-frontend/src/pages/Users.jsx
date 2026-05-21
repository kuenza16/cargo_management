import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import Register from "./Register.jsx";
import { Empty, PageHeader } from "../components/Common";

export default function Users() {
  const [rows, setRows] = useState([]),
    [show, setShow] = useState(false),
    [err, setErr] = useState("");
  // Remove local form state, Register handles its own form

  // Fetch all users from /api/auth/users
  const load = () =>
    api
      .get("/auth/users")
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

  // Handler to close modal and reload users after registration
  const handleRegisterClose = (refresh) => {
    setShow(false);
    if (refresh) load();
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage registered users and add new users."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + Add User
      </button>
      {err && <div className="alert error">{err}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(Boolean).map((x, i) => (
              <tr key={x?._id || `row-${i}`}>
                <td>{x?.name || "-"}</td>
                <td>{x?.email || "-"}</td>
                <td>{x?.role || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <Empty />}
      </div>
      {show && (
        <Modal title="Add User" onClose={() => handleRegisterClose(false)}>
          <Register asModal onSuccess={() => handleRegisterClose(true)} />
        </Modal>
      )}
    </>
  );
}
