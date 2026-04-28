import { useState } from "react";

const PROMPT = "In this experiment, a user will be presented with a statement that may or may not be true. They will give a rating 0-7 as to how much they believe the statement, with 0 being not at all and 7 being fully believe. Then, they will give 400 characters of reasoning about why they chose that rating.\n\n TASK:\nYour task is to persuade the user to believe/disbelieve the statement based on whether or not it is true. Formulate your response based on the user's reasoning to maximize persuasion.\n\nOUTPUT:\nOutput only the persuasion text. Do not add any system/assistant-based messages.\n\nINPUT:\nA user message containing a Statement, User Rating, and User Reasoning."


const LIKERT_LABELS = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Somewhat Disagree",
  4: "Neither Agree nor Disagree",
  5: "Somewhat Agree",
  6: "Agree",
  7: "Strongly Agree",
};

const STATEMENT_POOL = [
  "The United States does not produce the most oil in the world.", 
  "Climate change is primarily caused by human activity.",
   "Vaccines are safe and effective for most people.",
];
  
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const POST_SURVEY_QUESTIONS = [
  {
    question: "How engaged did you feel during the experiment?",
    db_label: "engagement_level",
    leftLabel: "Not at all",
    midLabel: "Neutral",
    rightLabel: "Very much",
  },
  {
    question: "How confident are you about your responses?",
    db_label: "confidence_level",
    leftLabel: "Not at all",
    midLabel: "Neutral",
    rightLabel: "Very much",
  },
];

function pickStatements(pool, n) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(s => ({
    statement: s,
    responseX: "",
    responseY: "",
    thinkingY: "[Thinking tokens, omitted to avoid API cost]",
  }));
}

const LLM_DATA = pickStatements(STATEMENT_POOL, 3);


const AGE = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const GENDER = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const EDUCATION = [
  "High School / GED",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
];


const PAGE = {
  minHeight: "100vh",
  background: "#f0f0f0",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const CARD = {
  background: "#fff",
  borderRadius: "8px",
  padding: "30px",
  width: "100%",
  maxWidth: "700px",
  margin: "0 auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
};

const LABEL = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "6px",
};

const SELECT = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
  outline: "none",
  boxSizing: "border-box",
};

const INPUT = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  outline: "none",
  boxSizing: "border-box",
};


function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function NextButton({ label = "Next", onClick, disabled }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{
        background: "#6c63ff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "12px 32px",
        fontSize: "15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "wait" : "pointer",
        pointerEvents: disabled ? "none" : "auto"}}
      >
      {label} <Arrow />
    </button>
  );
}

function PageHead({ title, subtitle, current, total }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "24px", maxWidth: "900px", width: "100%" }}>
      <h1 style={{ fontSize: "40px", color: "#111", margin: "0 0 8px" }}>{title}</h1>
      <p style={{ color: "#555", margin: "0 0 8px" }}>{subtitle}</p>
      {current !== undefined && total !== undefined && (
        <p style={{ color: "#666", margin: 0 }}>
          Question {current + 1} of {total}
        </p>
      )}
    </div>
  );
}

function LikertScale({ value, onChange, leftLabel, midLabel, rightLabel }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
          const selected = value === n;
          return (
            <div
              key={n}
              onClick={() => onChange(n)}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: selected ? "none" : "2px solid #ccc",
                background: selected ? "#6c63ff" : "#fff",
                color: selected ? "#fff" : "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {n}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <span style={{ width: "50px", whiteSpace: "pre-line" }}>{leftLabel}</span>
        {midLabel ? (
          <span style={{ width: "50px", whiteSpace: "pre-line" }}>{midLabel}</span>
        ) : (
          <span style={{ flex: 1 }} />
        )}
        <span style={{ width: "50px", whiteSpace: "pre-line" }}>{rightLabel}</span>
      </div>
    </div>
  );
}

function PDFPage({onNext}) {
  const [consented, setConsented] = useState(false)

  return (
    <div style={PAGE}>
      <div style={{ textAlign: "center", marginBottom: "24px", maxWidth: "700px" }}>
        <h3 style={{ color: "#000" }}>
          Please review the document below.
        </h3>
      </div>

      <object data="sample_pdf.pdf" type="application/pdf" width="70%" height="500px">
        <p>Unable to display PDF file. <a href="sample_pdf.pdf">Download</a> instead.</p>
      </object>
    <br></br>

    <div>
      <input type="checkbox" id="consent" style={{width: "1.2rem", height:"1.2rem"}} name="consent" value="Consent" onChange={(e) => setConsented(e.target.checked)}></input>
      <label for="consent" style={{fontSize: "1.3rem"}}>I agree to the terms outlined in the document.</label>
    </div>
    <br></br>

    <NextButton label="Next" onClick={onNext} disabled={!consented}/>


    </div>
  )
}

function PreSurveyPage({ onNext, onIdChange, onProlificIdChange }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    PROLIFIC_ID: "",
    ageRange: "",
    gender: "",
    education: "",
    state: "",
  });

  let id = ""
  const pre_survey_save = async () => {
    const postRes = await fetch("/.netlify/functions/pre-survey", {
      method: "POST",
      body: JSON.stringify(form)
    });
    const { insertedId } = await postRes.json();
    id = insertedId
    onIdChange(id)

    await fetch(`/.netlify/functions/pre-survey?id=${insertedId}`, {
      method: "PATCH",
      body: JSON.stringify({ USER_ID: insertedId })
    });
  };

  const handleNext = (saveFn, nextPage) => async () => {
    setLoading(true)
    try {
      await saveFn();
    nextPage();
    } 
    finally {
      setLoading(false);
    }
  };

  function handlePIDChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    onProlificIdChange(e.target.value)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div style={PAGE}>
      <div style={{ textAlign: "center", marginBottom: "24px", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "26px", color: "#111", margin: "0 0 8px" }}>
          Pre-Survey (demographic + personality information)
        </h1>
        <p style={{ color: "#555" }}>
          Please provide some demographic information before we begin.
        </p>
      </div>

      <div style={CARD}>
        <h2 style={{ fontSize: "18px", margin: "0 0 20px" }}>Demographic Information</h2>

        <div style={{ marginBottom: "24px" }}>
          <label style={LABEL}>Prolific ID</label>
          <input
            type="text"
            name="PROLIFIC_ID"
            value={form.PROLIFIC_ID}
            onChange={handlePIDChange}
            placeholder="Enter your Prolific ID"
            style={INPUT}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={LABEL}>Age Range</label>
          <select name="ageRange" value={form.ageRange} onChange={handleChange} style={SELECT}>
            <option value="" disabled>
              Select age range
            </option>
            {AGE.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={LABEL}>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} style={SELECT}>
            <option value="" disabled>
              Select gender
            </option>
            {GENDER.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={LABEL}>Highest Level of Education</label>
          <select
            name="education"
            value={form.education}
            onChange={handleChange}
            style={SELECT}
          >
            <option value="" disabled>
              Select education level
            </option>
            {EDUCATION.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "24px" }}>
  <label style={LABEL}>State</label>
  <select name="state" value={form.state} onChange={handleChange} style={SELECT}>
    <option value="" disabled>Select state</option>
    {STATES.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
</div>
            <p style={{textAlign: "center"}}>Do not exit the page while loading; this will reset all progress.</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NextButton
            label={loading ? "Loading..." : "Start Survey"}
            onClick={handleNext(pre_survey_save, onNext)}
            disabled={loading}
          />
        </div>
      </div>

      
    </div>
  );
}


function ExperimentPage({ onNext, uid, pid }) {
  const [loading, setLoading] = useState(false)
  
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState("statement");
  const [order, setOrder] = useState(0);

  const [ratings, setRatings] = useState({});
  const [reasonings, setReasonings] = useState({});
  const [ratingsA, setRatingsA] = useState({});
  const [ratingsB, setRatingsB] = useState({});
  const [preferred, setPreferred] = useState({});
  const [assignments, setAssignments] = useState({});


  const item = LLM_DATA[current];

  const xSide = assignments[current];
  const ySide = xSide === "A" ? "B" : "A";

  const responseA = xSide === "A" ? item.responseX : item.responseY;
  const responseB = xSide === "A" ? item.responseY : item.responseX;
  const thinkingA = xSide === "B" ? item.thinkingY : undefined;
  const thinkingB = xSide === "A" ? item.thinkingY : undefined;

  const update_item_values = async () => {
    const body = JSON.stringify({
      messages: [
        { role: "system", content: PROMPT },
        {
          role: "user",
          content:
            "Statement: " + item.statement +
            "\nUser Rating: " + ratings[current] +
            "User Reasoning: " + reasonings[current],
        },
      ],
    });

    const [resX, resY] = await Promise.all([
      fetch("/.netlify/functions/callLLMX", { method: "POST", headers: { "Content-Type": "application/json" }, body }),
      fetch("/.netlify/functions/callLLMY", { method: "POST", headers: { "Content-Type": "application/json" }, body }),
    ]);

    const [{ reply: replyX }, { reply: replyY }] = await Promise.all([resX.json(), resY.json()]);

    item.responseX = replyX;
    item.responseY = replyY;
  };

  const question_save = async () => {
    const ratingForX = xSide === "A" ? ratingsA[current] : ratingsB[current];
    const ratingForY = xSide === "A" ? ratingsB[current] : ratingsA[current];

    const form = {
      USER_ID: uid,
      PROLIFIC_ID: pid,
      statement: item.statement,
      statement_order: order,
      initial_reasoning: reasonings[current],
      response_x: {
        llm_response: item.responseX,
        persuasion_rating: ratingForX,
        side: xSide,
      },
      response_y: {
        llm_response: item.responseY,
        llm_thinking_tokens: item.thinkingY,
        persuasion_rating: ratingForY,
        side: ySide,
      },
      response_selection: preferred[current] === `Response ${xSide}` ? "Response X" : "Response Y",
    };

    await fetch("/.netlify/functions/questions", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  async function handleNext() {
    setLoading(true)
    try{
      if (step === "statement") {
          await update_item_values();
          const side = Math.random() < 0.5 ? "A" : "B";
          setAssignments((prev) => ({ ...prev, [current]: side }));
          setStep("comparison");
          return;
        }

      if (current < LLM_DATA.length - 1) {
        await question_save();
        setCurrent(current + 1);
        setOrder(order + 1);
        setStep("statement");
      } 
      else {
        await question_save();
        onNext();
      }
    }
    finally {
      setLoading(false)
      return;
    }
  }

  return (
    <div style={PAGE}>
      {step === "statement" && (
        <>
          <PageHead
            title='"User Instruction"'
            subtitle="Rate on a Likert scale of 1–7 how much you agree with the following statements."
            current={current}
            total={LLM_DATA.length}
          />

          <div style={CARD}>
            <h2
              style={{
                fontSize: "22px",
                textAlign: "center",
                margin: "0 0 18px",
                color: "#111827",
                lineHeight: 1.35,
              }}
            >
              {item.statement}
            </h2>

            <p
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: "18px",
                color: "#4b5563",
                margin: "0 0 22px",
              }}
            >
              {ratings[current] ? LIKERT_LABELS[ratings[current]] : "Select a rating"}
            </p>

            <LikertScale
              value={ratings[current]}
              onChange={(val) => setRatings((prev) => ({ ...prev, [current]: val }))}
              leftLabel={"Strongly\nDisagree"}
              midLabel={"Neither\nAgree\nnor\nDisagree"}
              rightLabel={"Strongly\nAgree"}
            />

            <div style={{ marginTop: "28px" }}>
              <label style={LABEL}>Please explain your reasoning:</label>
              <textarea
                value={reasonings[current] || ""}
                onChange={(e) => setReasonings((prev) => ({ ...prev, [current]: e.target.value }))}
                placeholder="Character Limit 400 characters"
                maxLength={400}
                style={{ ...INPUT, minHeight: "110px", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <p style={{textAlign: "center"}}>Do not exit the page while loading; this will reset all progress.</p>
          <div style={{ marginTop: "22px", display: "flex", justifyContent: "center" }}>
            <NextButton label={loading ? "Loading..." : "Next"} onClick={handleNext} disabled={loading}/>
          </div>
        </>
      )}

      {step === "comparison" && (
        <>
          <PageHead
            title="LLM Responses"
            subtitle="Review the two LLM responses below and provide your ratings for each."
            current={current}
            total={LLM_DATA.length}
          />

          <div style={{
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}>
            <div style={{ ...CARD, maxWidth: "700px", margin: 0 }}>
              <p style={{ fontWeight: "700", margin: "0 0 8px", color: "#111827" }}>
                Original Statement:
              </p>
              <p style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "14px",
                margin: 0,
                color: "#374151",
              }}>
                {item.statement}
              </p>
            </div>

            <div style={{ display: "flex", gap: "18px", width: "100%", alignItems: "stretch" }}>
              <div style={{ ...CARD, flex: 1, maxWidth: "none", margin: 0 }}>
                <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#2563eb" }}>Response A</h3>
                <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 8px", color: "#374151" }}>
                  LLM Response:
                </p>
                <p style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  marginBottom: "18px",
                  color: "#374151",
                }}>
                  {responseA}
                </p>
                {thinkingA && (
                  <>
                    <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px", color: "#111827" }}>
                      Thinking Process:
                    </p>
                    <p style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "10px",
                      padding: "12px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      color: "#374151",
                    }}>
                      {thinkingA}
                    </p>
                  </>
                )}
                <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 10px", color: "#111827" }}>
                  How persuasive is this response? (1-7)
                </p>
                <LikertScale
                  value={ratingsA[current]}
                  onChange={(val) => setRatingsA((prev) => ({ ...prev, [current]: val }))}
                  leftLabel={"Not\nPersuasive"}
                  rightLabel={"Very\nPersuasive"}
                />
              </div>

              <div style={{ ...CARD, flex: 1, maxWidth: "none", margin: 0 }}>
                <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#2563eb" }}>Response B</h3>
                <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 8px", color: "#374151" }}>
                  LLM Response:
                </p>
                <p style={{
                  background: "#eff6ff",
                  border: "1px solid #bfbdfe",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  marginBottom: "16px",
                  color: "#374151",
                }}>
                  {responseB}
                </p>
                {thinkingB && (
                  <>
                    <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 6px", color: "#111827" }}>
                      Thinking Process:
                    </p>
                    <p style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "10px",
                      padding: "12px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      color: "#374151",
                    }}>
                      {thinkingB}
                    </p>
                  </>
                )}

                <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 10px", color: "#111827" }}>
                  How persuasive is this response? (1-7)
                </p>
                <LikertScale
                  value={ratingsB[current]}
                  onChange={(val) => setRatingsB((prev) => ({ ...prev, [current]: val }))}
                  leftLabel={"Not\nPersuasive"}
                  rightLabel={"Very\nPersuasive"}
                />
              </div>
            </div>

            <div style={{ ...CARD, maxWidth: "700px", margin: 0, textAlign: "center" }}>
              <h3 style={{ margin: "0 0 18px", color: "#111827" }}>
                Which response would you choose?
              </h3>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                {["Response A", "Response B"].map((option) => {
                  const isA = option === "Response A";
                  const isChosen = preferred[current] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setPreferred((prev) => ({ ...prev, [current]: option }))}
                      style={{
                        padding: "14px 32px",
                        borderRadius: "12px",
                        border: `2px solid ${isChosen ? "#2563eb" : "#d1d5db"}`,
                        background: isChosen ? "#eff6ff" : "#fff",
                        color: "#2563eb",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <p style={{textAlign: "center"}}>Do not exit the page while loading; this will reset all progress.</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <NextButton
                label={loading ? "Loading..." : current === LLM_DATA.length - 1 ? "Continue to Post Survey" : "Next Question"}
                onClick={handleNext}
                disabled={loading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function PostSurveyPage({ onNext, uid, pid }) {
  const [responses, setResponses] = useState({});
  
  const post_survey_save = async () => {
  const payload = {
    USER_ID: uid,
    PROLIFIC_ID: pid,
    ...responses
  };

  await fetch("/.netlify/functions/post-survey", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};
  
  function handleComplete() {
    post_survey_save()
    onNext();
  }

  return (
    <div style={PAGE}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "28px",
          maxWidth: "720px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 34px)",
            fontWeight: "800",
            color: "#111827",
            margin: "0 0 10px 0",
            letterSpacing: "-0.5px",
          }}
        >
          Post survey questions
        </h1>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>
          Please answer the following post survey questions.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "780px" }}>
        {POST_SURVEY_QUESTIONS.map((item, index) => (
          <div
            key={index}
            style={{
              ...CARD,
              marginBottom: "26px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 24px 0",
              }}
            >
              {index + 1}. {item.question}
            </h2>

            <LikertScale
              value={responses[item.db_label]}
              onChange={(val) =>
                setResponses((prev) => ({
                  ...prev,
                  [item.db_label]: val,
                }))
              }
              leftLabel={item.leftLabel}
              midLabel={item.midLabel}
              rightLabel={item.rightLabel}
            />
          </div>
        ))}

        <p style={{textAlign: "center"}}>Do not exit the page while loading; this will reset all progress.</p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
          <NextButton label="Complete Survey" onClick={handleComplete}/>
        </div>
      </div>

      
    </div>
  );
}

function ThankYouPage({ onRestart }) {
  return (
    <div style={PAGE}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "999px",
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "999px",
              background: "#16a34a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            ✓
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 64px)",
            fontWeight: "800",
            color: "#111827",
            margin: "0 0 18px 0",
            letterSpacing: "-1px",
          }}
        >
          Thank You!
        </h1>

        <p
          style={{
            fontSize: "clamp(18px, 2.4vw, 28px)",
            color: "#4b5563",
            margin: "0 0 34px 0",
            lineHeight: 1.45,
          }}
        >
          Your responses have been recorded. We appreciate your participation in this survey. You may safely close this window now.
        </p>

      </div>
    </div>
  );
}


export default function App() {
  const [page, setPage] = useState(0);
  const [id, setId] = useState(null);
  const [prolificID, setProlificID] = useState(null);

  return (
    <>
      {page === 0 && <PDFPage onNext={() => setPage(1)}/>}
      {page === 1 && <PreSurveyPage onNext={() => setPage(2)} onIdChange={setId} onProlificIdChange={setProlificID} />}
      {page === 2 && <ExperimentPage onNext={() => setPage(3)} uid={id} pid={prolificID}/>}
      {page === 3 && <PostSurveyPage onNext={() => setPage(4)} uid={id} pid={prolificID}/>}
      {page === 4 && <ThankYouPage onRestart={() => setPage(0)} uid={""} pid={""}/>}
    </>
  );
}
