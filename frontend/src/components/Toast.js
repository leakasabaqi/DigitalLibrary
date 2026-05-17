import { useState, useEffect, useCallback } from "react";

let toastId = 0;
let addToastFn = null;
let confirmResolverFn = null;
let setConfirmMsgFn = null;

export function showToast(message, type = "success") {
  if (addToastFn) addToastFn(message, type);
}

export function showConfirm(message) {
  if (setConfirmMsgFn) {
    setConfirmMsgFn(message);
    return new Promise((resolve) => { confirmResolverFn = resolve; });
  }
  return Promise.resolve(false);
}

function ConfirmDialog() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setConfirmMsgFn = (m) => setMsg(m);
    return () => { setConfirmMsgFn = null; };
  }, []);

  if (!msg) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999999, padding: 16, fontFamily: "'Poppins', system-ui, sans-serif",
      }}
      onClick={() => { setMsg(null); confirmResolverFn?.(false); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 16, padding: "24px 24px 20px",
          maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 20, lineHeight: 1.4 }}>
          {msg}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => { setMsg(null); confirmResolverFn?.(false); }}
            style={{
              flex: 1, background: "transparent", border: "1px solid rgba(15,23,42,0.18)",
              borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit", color: "#334155",
            }}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => { setMsg(null); confirmResolverFn?.(true); }}
            style={{
              flex: 1, background: "#2563eb", border: "none",
              borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit", color: "#fff",
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const colors = {
    success: { bg: "#16a34a", icon: "✓" },
    error: { bg: "#dc2626", icon: "✕" },
    info: { bg: "#2563eb", icon: "i" },
  };

  return (
    <>
      <ConfirmDialog />
      <div
        style={{
          position: "fixed", top: 20, right: 20, zIndex: 99999,
          display: "flex", flexDirection: "column", gap: 8, maxWidth: 360,
        }}
      >
        {toasts.map((t) => {
          const c = colors[t.type] || colors.info;
          return (
            <div
              key={t.id}
              style={{
                background: c.bg, color: "#fff", padding: "12px 16px",
                borderRadius: 12, fontWeight: 600, fontSize: 13,
                boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
                display: "flex", alignItems: "center", gap: 10,
                animation: "toastSlideIn .25s ease",
                fontFamily: "'Poppins', system-ui, sans-serif",
              }}
            >
              <span
                style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "grid", placeItems: "center",
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                }}
              >
                {c.icon}
              </span>
              {t.message}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
