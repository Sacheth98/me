import React, { useState, useEffect } from "react";

const CICDPipelineVisual = () => {
  const [step, setStep] = useState(0);
  const maxSteps = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prevStep) => (prevStep + 1) % (maxSteps + 1));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const stages = [
    { name: "Commit", icon: "💻", color: "#0078D4" },
    { name: "Build", icon: "🔨", color: "#00A4EF" },
    { name: "Test", icon: "🧪", color: "#FFB900" },
    { name: "Deploy", icon: "🚀", color: "#F25022" },
    { name: "Monitor", icon: "📊", color: "#7FBA00" },
  ];

  return (
    <div className="cicd-visual">
      <div className="pipeline">
        {stages.map((stage, index) => (
          <div key={index} className="pipeline-stage">
            <div
              className={`stage-icon ${
                step > index ? "completed" : step === index ? "active" : ""
              }`}
              style={{
                backgroundColor:
                  step >= index ? stage.color : "rgba(255, 255, 255, 0.1)",
                borderColor: stage.color,
              }}
            >
              <span>{stage.icon}</span>

              {step > index && <div className="checkmark">✓</div>}
            </div>

            <div className="stage-name">{stage.name}</div>

            {index < stages.length - 1 && (
              <div
                className={`connection-line ${step > index ? "active" : ""}`}
                style={{
                  backgroundColor:
                    step > index ? stage.color : "rgba(255, 255, 255, 0.1)",
                }}
              >
                {step === index && (
                  <div
                    className="moving-dot"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {step === maxSteps && (
        <div className="deployment-success">
          <div className="success-icon">✓</div>
          <div className="success-message">Deployment Successful!</div>
          <div className="metrics">
            <div className="metric">
              <span className="metric-value">300%</span>
              <span className="metric-label">Faster</span>
            </div>
            <div className="metric">
              <span className="metric-value">90%</span>
              <span className="metric-label">Error Reduction</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CICDPipelineVisual;
