import {useState, useRef, useEffect } from "react";

const QUESTIONS = [
    "The United States does not produce the most oil in the world",
    "Climate change is primarily caused by human activity",
    "Vaccines are safe and effective for most people",
];

const LIKELABELS = {
    1: "Strongle Disagree",
    2: "Disagree",
    3: "Somewhat Disagree",
    4: "Neither Agree nor Disagree",
    5: "Somewhat Agree",
    6: "Agree",
    7: "Strongly Agree",
};

const LLM_DATA = [
    {
      statement: "The United States does not produce the most oil in the world.",
      responseA: "According to recent data from the U.S. Energy Information Administration, the United States is actually the world's largest oil producer, surpassing both Russia and Saudi Arabia in recent years. This has been driven by advances in shale oil extraction technology.",
      responseB: "The statement is incorrect and this is response B",
      thinkingB: "I need to evaluate....",
    },
    {
      statement: "Climate change is primarily caused by human activity.",
      responseA: "There is overwhelming scientific consensus that human activities, particularly burning fossil fuels and deforestation, are the primary drivers of modern climate change.",
      responseB: "While natural factors do influence climate, the current rate of warming aligns strongly with industrial emissions data.",
      thinkingB: "I need to consider multiple perspectives here....",
    },
    {
      statement: "Vaccines are safe and effective for most people.",
      responseA: "Decades of clinical research confirm that vaccines approved for public use are both safe and effective. Serious adverse effects are rare and monitored through robust surveillance systems.",
      responseB: "Vaccines undergo rigorous trials before approval. The benefit-risk profile for approved vaccines is strongly positive for the general population.",
      thinkingB: "Let me evaluate the evidence carefully....",
    },
  ];

const HELP = [
    ["Help Center", "Support Forum", "YouTube videos", "Release notes", "Legal summary"],
  ["Ask the community", "Contact support", "Check network settings", "Report abuse"],
  ["Change keyboard layout...", "Change language..."],
];

const AGE = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const GENDER = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const EDUCATION = ["High School / GED", "Some College", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"];

const PAGE = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #fdf4ff 50%, #e0e7ff 100%)",
    display: "flex",
    flexDirection: "column",
}

const PAGE = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #fdf4ff 50%, #e0e7ff 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px 100px",
    fontFamily: "'Segoe UI', system-ui, san-serif",
};

const CARD = {
    background: "#fff",
    borderRadius: "18px",
    padding: "36px 40px 40px",
    width: "100%",
    maxWidth: "780px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
};
const STOPSTART = {
    background: "linear-gradient(to right, #93c5fd, #a78bfa, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "16px 52px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 20px rgba(167,139,250,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s",
};

const LABEL = {
  display: "block",
  fontSize: "13.5px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "8px",
};

const SELECT = {
  width: "100%",
  padding: "14px 18px",
  fontSize: "15px",
  color: "#374151",
  background: "#fff",
  border: "1.5px solid #d1d5db",
  borderRadius: "10px",
  appearance: "none",          
  WebkitAppearance: "none",     
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  cursor: "pointer",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

function ChevronIcon() {
    return(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function NextButton({ label = "Next", onClick }) {
    const[hovered, setHovered] = useState(false);
    return (
    <button
        onClick = {onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style = {{
        ...STOPSTART,
        transform hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered
        ? "0 6px 24px rgba(167,139,250,0.5)"
        : STOPSTART.boxShadow,
    }}
    >
        {label}
        <ChevronIcon />
    </button>
);
}

function PageHead ({ title, subtitle, current, total }) {
    return (
        <div style={{ textAlign: "center", marginBottom: "28px", maxWidth: "720px", width: "100%" }}>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: "800", color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
                {title}
            </h1>
             <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 6px" }}>{subtitle}</p>
            {current !== undefined && (
                <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
                      Question {current + 1} of {total}
                </p>
              )}
            </div>
  );
}
 
        
