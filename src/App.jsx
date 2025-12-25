import React, { useState } from 'react'
import './styles.css'

function App() {
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

  const [blueprintGenerated, setBlueprintGenerated] = useState(false)
  const [blueprintData, setBlueprintData] = useState('')   // final AI text
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
    setBlueprintGenerated(false)

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

      // n8n returns the OpenAI response JSON from the last node
      const content = data?.choices?.[0]?.message?.content || ''

      setBlueprintData(content)
      setBlueprintGenerated(true)
    } catch (err) {
      console.error('Blueprint error:', err)
      setError('Blueprint generation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
        {/* Left Side - Form */}
        <div className="form-section">
          <div className="form-card">
            <h2 className="phase-title">Phase 0: Intake - Project Basics</h2>

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
              <label htmlFor="primaryTargetAudience">Primary Target Audience:</label>
              <input
                type="text"
                id="primaryTargetAudience"
                name="primaryTargetAudience"
                placeholder="e.g. Elderly patients living alone"
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
                placeholder="e.g. Serious, Clinical, Highly accessible..."
                value={formData.designGuidelines}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Blueprint Content */}
        <div className="content-section">
          <div className="content-card">
            {!blueprintGenerated ? (
              <div className="empty-state">
                {isLoading ? (
                  <>
                    <h3 className="empty-title">Generating Blueprint…</h3>
                    <p className="empty-description">
                      Running UX research & structuring the layout based on your inputs.
                    </p>
                  </>
                ) : (
                  <>
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
                      Fill in the project details on the left and click "Generate Blueprint"
                      to see the research synthesis and structural flow.
                    </p>
                  </>
                )}
                {error && <p className="error-message">{error}</p>}
              </div>
            ) : (
              <div className="blueprint-content">
                <h3>Blueprint Generated</h3>
                <pre className="blueprint-text">
                  {blueprintData}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
