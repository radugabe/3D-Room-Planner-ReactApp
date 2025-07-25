import { useState } from "react";

const HelpTooltip = ({ title, steps = [], icon }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setVisible(prev => !prev)}
        title={title}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: "0.25rem 0.5rem"
        }}
      >
        {icon}
      </button>

      {visible && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            width: "250px",
            zIndex: 999
          }}
        >
          <h4 style={{ marginTop: 0 }}>{title}</h4>
          <ul style={{ paddingLeft: "1.2em" }}>
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
