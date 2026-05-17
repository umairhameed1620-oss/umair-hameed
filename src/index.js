import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "AisleMart2024") {
      onLogin();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0f1117",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontSize:32,fontWeight:800,color:"#e2e8f0"}}>🛒 AisleMart</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:8}}>Owner Dashboard — Sign in to continue</div>
      <div style={{background:"#161922",border:"1px solid #252a3a",borderRadius:12,padding:"32px 40px",display:"flex",flexDirection:"column",gap:12,minWidth:320}}>
        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>PASSWORD</label>
        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{background:"#0d1018",border:"1px solid #252a3a",borderRadius:8,padding:"10px 14px",color:"#e2e8f0",fontSize:14,outline:"none"}}
        />
        {error && <div style={{color:"#ef4444",fontSize:12}}>{error}</div>}
        <button
          onClick={handleLogin}
          style={{background:"#2d6a4f",color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:4}}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function Root() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("aislemart_auth") === "true"
  );

  const handleLogin = () => {
    sessionStorage.setItem("aislemart_auth", "true");
    setLoggedIn(true);
  };

  return loggedIn ? <App /> : <Login onLogin={handleLogin} />;
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<React.StrictMode><Root /></React.StrictMode>);
