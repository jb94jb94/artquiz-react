import { useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {isLogin ? "Einloggen" : "Registrieren"}
      </button>
      <button type="button" onClick={() => setIsLogin(!isLogin)} disabled={loading}>
        {isLogin ? "Noch kein Konto? Registrieren" : "Bereits registriert? Einloggen"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
