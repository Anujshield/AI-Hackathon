import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import "./App.css";

function ArchitectureDiagram() {
  const diagramRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      if (!diagramRef.current) return;

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
        });

        const diagram = `
flowchart TD
    A["Business Requirement"] --> B["AI Analysis"]
    B --> C["React + Vite"]
    C --> D["Python + FastAPI"]
    D --> E["Pydantic Validation"]
    D --> F["PostgreSQL"]
    D --> G["Groq API"]
    D --> H["Authentication & RBAC"]
`;

        const renderId = `architecture-${Date.now()}`;

        const { svg } = await mermaid.render(
          renderId,
          diagram
        );

        if (!cancelled && diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);

        if (!cancelled && diagramRef.current) {
          diagramRef.current.innerHTML =
            "<p>Unable to render architecture diagram.</p>";
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="architecture-diagram"
      ref={diagramRef}
    />
  );
}
function App() {
  const [requirement, setRequirement] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeRequirement = async () => {
    if (!requirement.trim()) {
      setError("Please enter a software requirement.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirement: requirement,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze requirement");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not analyze the requirement. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="badge">AI-POWERED SOFTWARE ARCHITECT</div>

          <h1>
            AI Requirements
            <span> → Software Architect</span>
          </h1>

          <p>
            Transform natural-language business requirements into a complete
            technical blueprint.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="input-section">
          <h2>Describe Your Requirement</h2>

          <p>
            Tell us what you want to build. Our AI will analyze the requirement
            and design the system.
          </p>

          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Example: Build an employee leave management system..."
          />

          <div className="input-footer">
            <span>{requirement.length} characters</span>

            <button
              onClick={analyzeRequirement}
              disabled={loading}
              className="generate-button"
            >
              {loading ? "Analyzing..." : "Generate Architecture →"}
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </section>

        {result && (
          <section className="results">
            <div className="results-header">
              <div className="badge">AI ANALYSIS COMPLETE</div>
              <h2>Technical Blueprint</h2>
            </div>

            <div className="card">
              <h3>📋 Business Summary</h3>
              <p>{result.summary}</p>
            </div>

            <div className="card">
              <h3>⚙️ Functional Requirements</h3>

              {result.functional_requirements?.map((item) => (
                <div key={item.id} className="requirement">
                  <div className="requirement-top">
                    <strong>{item.id}</strong>
                    <span className="priority">{item.priority}</span>
                  </div>

                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>📈 Non-Functional Requirements</h3>

              <ul>
                {result.non_functional_requirements?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>👥 Users & Roles</h3>

              <div className="tag-container">
                {result.users_roles?.map((item, index) => (
                  <span className="tag" key={index}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
  <h3>🏗️ System Architecture</h3>

  <pre>{result.architecture}</pre>

  <h4>Architecture Diagram</h4>

  <ArchitectureDiagram />
</div>

            <div className="card">
              <h3>🗄️ Database Design</h3>

              {result.database_entities?.map((entity, index) => (
                <div key={index} className="entity">
                  <h4>{entity.name}</h4>
                  <p>{entity.description}</p>

                  <div className="fields">
                    <strong>Fields:</strong>

                    {entity.fields?.map((field, fieldIndex) => (
                      <span key={fieldIndex}>{field}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>🔌 API Endpoints</h3>

              {result.api_endpoints?.map((api, index) => (
                <div key={index} className="api">
                  <div className="api-top">
                    <span className="method">{api.method}</span>
                    <code>{api.path}</code>
                  </div>

                  <p>{api.description}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>🔐 Security Considerations</h3>

              <ul>
                {result.security_considerations?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>🧪 Test Cases</h3>

              {result.test_cases?.map((test, index) => (
                <div key={index} className="test">
                  <strong>
                    Test Case {index + 1}: {test.scenario}
                  </strong>

                  <p>
                    <strong>Expected:</strong> {test.expected_result}
                  </p>
                </div>
              ))}
            </div>

            <div className="card warning">
              <h3>⚠️ Ambiguities / Missing Requirements</h3>

              {result.ambiguities?.length > 0 ? (
                <ul>
                  {result.ambiguities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No major ambiguities identified.</p>
              )}
            </div>

            <div className="card">
              <h3>💡 Assumptions</h3>

              <ul>
                {result.assumptions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;