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
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-black/5 p-8">
        
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-600 text-sm px-4 py-2 text-center ring-1 ring-red-200">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full rounded-xl bg-white
              ring-1 ring-black/10
              px-4 py-2
              focus:ring-2 focus:ring-blue-500/40
              outline-none transition
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full rounded-xl bg-white
              ring-1 ring-black/10
              px-4 py-2
              focus:ring-2 focus:ring-blue-500/40
              outline-none transition
            "
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`
            cursor-pointer w-full py-3 rounded-xl
            text-white font-medium transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-700 hover:shadow-lg"
            }
          `}
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </div>
    </div>
  );
}
