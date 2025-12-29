import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const API = "http://localhost:4000/api/notes";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API);
      setNotes(response.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(`${API}/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(API, formData);
      }
      setFormData({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}> Smart Notes Manager</h1>
        <p style={{ color: '#7f8c8d' }}>Organize your thoughts efficiently</p>
      </header>

      <section style={{ marginBottom: '25px' }}>
        <input 
          type="text"
          placeholder=" Search notes by title..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' }}
        />
      </section>

      <section style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '35px' }}>
        <h3 style={{ marginTop: '0', color: '#34495e' }}>{editId ? 'Edit Note' : 'Create New Note'}</h3>
        <input 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Note Title" 
          required 
          style={{ width: '100%', marginBottom: '15px', padding: '12px', borderRadius: '6px', border: '1px solid #eee', boxSizing: 'border-box' }}
        />
        <textarea 
          value={formData.content} 
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Write your content here..." 
          required 
          style={{ width: '100%', marginBottom: '15px', padding: '12px', minHeight: '120px', borderRadius: '6px', border: '1px solid #eee', boxSizing: 'border-box', resize: 'vertical' }}
        />
        <button 
          type="submit" 
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', cursor: 'pointer', background: editId ? '#f39c12' : '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', transition: '0.3s' }}
        >
          {editId ? 'Update Information' : 'Save Note'}
        </button>
      </section>

      <section>
        {notes.length === 0 && <p style={{ textAlign: 'center', color: '#95a5a6' }}>Your workspace is currently empty.</p>}
        
        {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase())).map(note => (
          <div key={note._id} style={{ borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '10px' }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{note.title}</h2>
            <p style={{ color: '#34495e', lineHeight: '1.6' }}>{note.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '13px', color: '#bdc3c7' }}> {new Date(note.createdAt).toLocaleString()}</span>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => {setEditId(note._id); setFormData({title: note.title, content: note.content})}} 
                  style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}>
                  Edit
                </button>
                <button 
                  onClick={() => deleteNote(note._id)} 
                  style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;