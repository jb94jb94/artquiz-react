import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // oder dein Supabase-Setup
import "./Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // zurück zur Startseite
  };

  return (
    <nav className="navbar">
      <Link to="/">Start</Link>
      <Link to="/liked">Favoriten</Link>
      <Link to="/stats">Statistik</Link>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
}