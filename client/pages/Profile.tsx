import { useState } from "react";

// Define the structure of the user object
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the structure of the successful login response
interface LoginResponse {
  token: string;
  user: User;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(
    () => {
      // Restore session from localStorage
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
  );

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const loginUser = (token: string, user: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setLoggedInUser(user);
    console.log("User logged in and session saved.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const { token, user } = data as LoginResponse;
        loginUser(token, user);
        setEmail("");
        setPassword("");
      } else {
        setError(data.msg || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please check your connection.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {loggedInUser ? (
        // --- PROFILE VIEW ---
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Welcome, {loggedInUser.name || "User"} 👋</h1>
          <p className="mt-2 text-lg text-muted-foreground">{loggedInUser.email}</p>

          <div className="mt-8 border rounded-xl p-6 grid gap-4 text-left max-w-md mx-auto">
            <button className="w-full rounded-md border px-4 py-3 text-left hover:bg-gray-100">
              ⚙️ Settings
            </button>
            <button className="w-full rounded-md border px-4 py-3 text-left hover:bg-gray-100">
              ❤️ Wishlisted Products
            </button>
            <button className="w-full rounded-md border px-4 py-3 text-left hover:bg-gray-100">
              🌐 Change Language
            </button>
            <button className="w-full rounded-md border px-4 py-3 text-left hover:bg-gray-100">
              ❓ Help Center
            </button>
            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-500 text-white px-4 py-3 hover:bg-red-600"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      ) : (
        // --- LOGIN FORM VIEW ---
        <div>
          <h1 className="text-3xl font-semibold text-center">Login or Create Account</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Enter your details to sign in. New users will be registered automatically.
          </p>
          <form
            className="mt-8 max-w-md mx-auto border rounded-xl p-6 grid gap-4"
            onSubmit={handleLogin}
          >
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-5 py-3 text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login / Sign Up"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
