import React,  { useEffect } from "react";
import { loginRequest } from "../../../src/auth/authConfig";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginView = () => {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleLogin = () => {
        instance.loginRedirect(loginRequest);
    };
    
    const handleLogout = () => {
    instance.logoutRedirect();
    };
    
    const isAuthenticated = accounts.length > 0;
    const name = isAuthenticated ? (accounts[0].name || accounts[0].username) : null;
    
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.background =
          "radial-gradient(circle at 30% 20%, rgba(50, 90, 180, 0.35), transparent 40%), linear-gradient(135deg, #0c0d10 0%, #161820 50%, #0c0d10 100%)";
        document.body.style.color = "#e0e0e0";
        document.body.style.fontFamily = "'Poppins', sans-serif";
        document.body.style.minHeight = "100vh";
        document.documentElement.style.background = "none";
        return () => {
          document.body.style = "";
        };
      }, []);

    useEffect(() => {
        if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state]);

    return (
        <div
            style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 16,
            background:
                "radial-gradient(circle at 30% 20%, rgba(50, 90, 180, 0.35), transparent 40%), linear-gradient(135deg, #0c0d10 0%, #161820 50%, #0c0d10 100%)",
            fontFamily: "'Poppins', sans-serif",
            color: "#e0e0e0",
            }}
        >
            <div
            style={{
                width: 420,
                maxWidth: "100%",
                borderRadius: 20,
                background:
                "linear-gradient(160deg, rgba(22,22,25,0.96), rgba(27,29,34,0.98))",
                boxShadow:
                "0 0 40px rgba(0, 0, 0, 0.6), 0 0 80px rgba(25,118,210,0.08)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
            {/* Encabezado */}
            <div
                style={{
                padding: "30px 28px 18px",
                background:
                    "linear-gradient(180deg, rgba(25,118,210,0.12), rgba(25,118,210,0.03))",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <div
                style={{
                    width: 58,
                    height: 58,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(25,118,210,0.12)",
                    border: "1px solid rgba(25,118,210,0.3)",
                    marginBottom: 14,
                }}
                >
                <svg width="26" height="26" viewBox="0 0 24 24">
                    <path
                    d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
                    fill="#2196f3"
                    />
                </svg>
                </div>
                <h1
                style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.3px",
                }}
                >
                {isAuthenticated ? "Sesión iniciada" : "Bienvenido"}
                </h1>
                <p
                style={{
                    marginTop: 6,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 15,
                    fontWeight: 400,
                }}
                >
                {isAuthenticated
                    ? "Acceso verificado correctamente."
                    : "Inicia sesión para continuar."}
                </p>
            </div>

            <div style={{ padding: 28 }}>
                {!isAuthenticated ? (
                <button
                    onClick={handleLogin}
                    style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "none",
                    background:
                        "linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)",
                    backgroundSize: "200%",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: "0.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition:
                        "background-position .4s ease, box-shadow .3s ease, transform .1s ease",
                    boxShadow: "0 4px 18px rgba(25,118,210,0.4)",
                    }}
                    onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundPosition = "right center";
                    e.currentTarget.style.boxShadow =
                        "0 6px 22px rgba(25,118,210,0.5)";
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundPosition = "left center";
                    e.currentTarget.style.boxShadow =
                        "0 4px 18px rgba(25,118,210,0.4)";
                    }}
                >
                    <span
                    style={{
                        width: 18,
                        height: 18,
                        display: "grid",
                        gridTemplateColumns: "repeat(2,1fr)",
                        gridTemplateRows: "repeat(2,1fr)",
                        gap: 2,
                    }}
                    >
                    <span style={{ background: "#f25022" }} />
                    <span style={{ background: "#7fba00" }} />
                    <span style={{ background: "#00a4ef" }} />
                    <span style={{ background: "#ffb900" }} />
                    </span>
                    Iniciar sesión con Microsoft
                </button>
                ) : (
                <div
                    style={{
                    display: "grid",
                    gap: 14,
                    alignItems: "center",
                    justifyItems: "stretch",
                    }}
                >
                    <div
                    style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(25,118,210,0.18)",
                        border: "1px solid rgba(25,118,210,0.4)",
                        color: "#90caf9",
                        fontSize: 15,
                        fontWeight: 500,
                    }}
                    >
                    Hola, <strong>{name}</strong>
                    </div>
                    <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.07)",
                        cursor: "pointer",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        transition:
                        "background .2s ease, border-color .2s ease, transform .1s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.97)";
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    >
                    Cerrar sesión
                    </button>
                </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                padding: "12px 20px 20px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: 400,
                display: "flex",
                justifyContent: "space-between",
                }}
            >
                <span>© {new Date().getFullYear()} Duoc UC</span>
            </div>
            </div>
      </div>
    );
}

export default LoginView;