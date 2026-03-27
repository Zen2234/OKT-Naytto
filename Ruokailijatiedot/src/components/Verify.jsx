import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Vahvistetaan kirjautumista...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("Virhe: Linkki on virheellinen tai puuttuu.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Linkki on vanhentunut tai virheellinen.");
        }

        localStorage.setItem("sessionToken", data.token);
        localStorage.setItem("userEmail", data.email);

        setStatus("Kirjautuminen onnistui! Ohjataan sovellukseen...");
        
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        setStatus(err.message);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <h2>{status}</h2>
    </div>
  );
}