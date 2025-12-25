import React, { useState } from 'react'
import './styles.css'

function App() {
  // Phase 0 – Intake form
  const [formData, setFormData] = useState({
    brandName: '',
    marketIndustry: '',
    projectType: 'Landing Page',
    primaryTargetAudience: '',
    primaryUserGoal: '',
    businessGoal: '',
    mustInclude: '',
    mustAvoid: '',
    designGuidelines: ''
  })

  // Result states (Phases 1–4)
  const [researchSummary, setResearchSummary] = useState('')   // Phase 1–2
  const [promptSeeds, setPromptSeeds] = useState('')           // Phase 3
  const [wireframeRaw, setWireframeRaw] = useState('')         // Phase 4 (JSON string)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- Helpers --------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerateBlueprint = async () => {
    setIsLoading(true)
    setError(null)

    // Reset old results
    setResearchSummary('')
    setPromptSeeds('')
    setWireframeRaw('')

    try {
      const response = await fetch(
        'https://poojatailor.app.n8n.cloud/webhook/ux-blueprint',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      )

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()

      // 1) Preferred: clean JSON from n8n (recommended)
      if (data.research_summary || data.prompt_seeds || data.wireframe_raw) {
        setResearchSummary(data.research_summary || '')
        setPromptSeeds(data.prompt_seeds || '')
        setWireframeRaw(
          typeof data.wireframe_raw === 'string'
            ? data.wireframe_raw
            : JSON.stringify(data.wireframe_raw, null, 2)
        )
      } else {
        // 2) Fallback: raw OpenAI response (older version of the workflow)
        const content = data?.choices?.[0]?.message?.content || ''
        setResearchSummary(content)
        setPromptSeeds('')
        setWireframeRaw('')
      }
    } catch (err) {
      console.error('Blueprint error:', err)
      setError('Blueprint generation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadSummary = () => {
    if (!researchSummary) return
    const blob = new Blob([researchSummary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.brandName || 'project'}_ux_research_summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // --------------------------------------------------------------

  const hasResults = !!(researchSummary || promptSeeds || wireframeRaw)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-square">UX</div>
          <div className="logo-text">
            <h1 className="logo-title">Blueprint Engine</h1>
            <p className="logo-subtitle">RESEARCH-TO-STRUCTURE TOOL</p>
          </div>
        </div>
        <button
          className="generate-btn"
          onClick={handleGenerateBlueprint}
          disabled={isLoading}
        >
          {isLoading ? 'Generating…' : 'Generate Blueprint'}
        </button>
      </header>

      {/* Main Content */}
      <div className="main-container">
        {/* LEFT – Phase 0: Intake */}
        <div className="form-section">
          <div className="form-card">
            <h2 className="phase-title">Phase 0: Intake – Project Basics</h2>

            <div className="form-group">
              <label htmlFor="brandName">Brand Name:</label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="e.g. Lumina Health"
                value={formData.brandName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="marketIndustry">Market / Industry:</label>
              <input
                type="text"
                id="marketIndustry"
                name="marketIndustry"
                placeholder="e.g. Digital Healthcare, B2C Telemedicine"
                value={formData.marketIndustry}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type:</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
              >
                <option value="Landing Page">Landing Page</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Dashboard">Dashboard</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>

            <div className="section-divider">
              <h3 className="section-title">User & Goal</h3>
            </div>

            <div className="form-group">
              <label htmlFor="primaryTargetAudience">
                Primary Target Audience:
              </label>
              <input
                type="text"
                id="primaryTargetAudience"
                name="primaryTargetAudience"
                placeholder="e.g. Adults 30–55 with chronic lifestyle conditions"
                value={formData.primaryTargetAudience}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="primaryUserGoal">Primary User Goal:</label>
              <textarea
                id="primaryUserGoal"
                name="primaryUserGoal"
                placeholder="What does the user want to achieve?"
                value={formData.primaryUserGoal}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessGoal">Business Goal / Desired Action:</label>
              <textarea
                id="businessGoal"
                name="businessGoal"
                placeholder="What is the conversion event?"
                value={formData.businessGoal}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="section-divider">
              <h3 className="section-title">Constraints & Tone</h3>
            </div>

            <div className="form-group">
              <label htmlFor="mustInclude">Must Include:</label>
              <textarea
                id="mustInclude"
                name="mustInclude"
                placeholder="Non-negotiable features or sections..."
                value={formData.mustInclude}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mustAvoid">Must Avoid:</label>
              <textarea
                id="mustAvoid"
                name="mustAvoid"
                placeholder="Patterns or content to stay away from..."
                value={formData.mustAvoid}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designGuidelines">
                Design Guidelines / Tone (Optional):
              </label>
              <textarea
                id="designGuidelines"
                name="designGuidelines"
                placeholder="e.g. Calm, medically credible, highly accessible..."
                value={formData.designGuidelines}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* RIGHT – Phases 1–5 */}
        <div className="content-section">
          <div className="content-card">
            {!hasResults && !isLoading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="8"
                      y1="8"
                      x2="16"
                      y2="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="8"
                      y1="12"
                      x2="16"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="empty-title">No Blueprint Generated Yet</h3>
                <p className="empty-description">
                  Fill in the project details on the left and click
                  {' '}“Generate Blueprint” to run UX research and get a structured layout.
                </p>
                {error && <p className="error-message">{error}</p>}
              </div>
            )}

            {isLoading && (
              <div className="empty-state">
                <h3 className="empty-title">Generating Blueprint…</h3>
                <p className="empty-description">
                  Running UX research phases and composing the wireframe blueprint
                  based on your inputs.
                </p>
              </div>
            )}

            {!isLoading && hasResults && (
              <div className="blueprint-content">
                {/* Phase 1–2: UX Research / Summary */}
                {researchSummary && (
                  <section className="blueprint-section">
                    <h3>Phase 1–2: UX Research & Summary</h3>
                    <pre className="blueprint-text">
                      {researchSummary}
                    </pre>
                  </section>
                )}

                {/* Phase 3: Prompt Seeds */}
                {promptSeeds && (
                  <section className="blueprint-section">
                    <h3>Phase 3: Research Summary for Prompts</h3>
                    <pre className="blueprint-text">
                      {promptSeeds}
                    </pre>
                  </section>
                )}

                {/* Phase 4: Wireframe JSON */}
                {wireframeRaw && (
                  <section className="blueprint-section">
                    <h3>Phase 4: Wireframe Blueprint (JSON)</h3>
                    <pre className="blueprint-text">
                      {wireframeRaw}
                    </pre>
                  </section>
                )}

                {/* Phase 5: Download */}
                {researchSummary && (
                  <section className="blueprint-section">
                    <h3>Phase 5: Export</h3>
                    <button
                      type="button"
                      className="generate-btn"
                      onClick={handleDownloadSummary}
                    >
                      ⬇️ Download Research Summary (.txt)
                    </button>
                  </section>
                )}

                {error && <p className="error-message">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
