import React, { useState } from 'react'

function App() {
  const [jobDesc, setJobDesc] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [updated, setUpdated] = useState([])

  const fetchJobDescription = async () => {
    if (window.chrome && chrome.tabs && chrome.scripting) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText
      })
      setJobDesc(result)
    } else {
      alert('Chrome extension APIs not available. Paste job description manually.')
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const text = await file.text()
      setResumeText(text)
    }
  }

  const optimizeResume = async () => {
    const res = await fetch('http://localhost:8000/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDesc, resume_text: resumeText })
    })
    const data = await res.json()
    setUpdated(data.updated_bullets)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Resume Optimizer</h1>
      <button onClick={fetchJobDescription}>Grab Job Description</button>
      <div style={{ margin: '1rem 0' }}>
        <label>Upload Resume:</label>
        <input type="file" accept=".txt" onChange={handleResumeUpload} />
      </div>
      <button onClick={optimizeResume}>Optimize Resume</button>
      <h2>Updated Bullet Points</h2>
      <ul>
        {updated.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
