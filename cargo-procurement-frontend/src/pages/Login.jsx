import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Common";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user count from backend
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data?.data) ? data.data : [];
        setUserCount(arr.length);
      })
      .catch(() => setUserCount(0));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Cargo ERP Login</h1>
        <p>Manage cargo, procurement and invoices.</p>
        <Alert message={error} />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn primary">Login</button>
        {userCount === 0 && (
          <span>
            New user? <Link to="/register">Create account</Link>
          </span>
        )}
        {userCount === 0 && (
          <span>
            <Link to="/track">Track shipment</Link>
          </span>
        )}
      </form>
    </div>
  );
}
