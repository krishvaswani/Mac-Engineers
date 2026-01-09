import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../Firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin", { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur rounded-2xl shadow-lg ring-1 ring-black/5 p-8">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2 text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 focus:ring-2 focus:ring-black/30 outline-none transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 focus:ring-2 focus:ring-black/30 outline-none transition"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl cursor-pointer text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:opacity-90"
          }`}
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </div>
    </div>
  );
}
