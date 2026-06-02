import { useState } from 'react'
export default function FileDropzone({ onFileSelect, file }) {
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowed.includes(f.type)) {
      alert('Only PDF and DOCX allowed')
      return
    }
    onFileSelect(f)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      onClick={() => document.getElementById('dropzone-input').click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--accent)' : file ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '3rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? '#6c63ff11' : file ? '#22c55e11' : 'var(--bg2)',
        transition: 'all 0.2s'
      }}>
      <input id="dropzone-input" type="file"
        accept=".pdf,.docx" style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])} />
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>
        {file ? '✅' : '📄'}
      </div>
      {file ? (
        <>
          <div style={{ fontWeight: 600, color: 'var(--green)' }}>{file.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>
            {(file.size / 1024).toFixed(1)} KB — click to change
          </div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>Drag & drop resume here</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)' }}>PDF and DOCX supported</div>
        </>
      )}
    </div>
  )
}