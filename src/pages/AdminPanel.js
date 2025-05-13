// // src/pages/AdminPanel.js
import './AdminPanel.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();
  const token = localStorage.getItem('adminToken');
  const [tab, setTab] = useState('category');
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  // const [questionId, setQuestionId] = useState('');
  // const [options] = useState({ A: '', B: '', C: '', D: '' });
  // const [correctAnswer] = useState('');
  const [settings, setSettings] = useState({ maxQuestions: 20, durationInMinutes: 20 });

  useEffect(() => {
    if (!token) navigate('/admin-login');
    axios.get('https://career-tool.onrender.com/api/admin-category/all')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [token, navigate]);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // const handleAddCategory = async () => {
  //   if (!categoryName) return alert('Enter category name');
  //   await axios.post('https://career-tool.onrender.com/api/admin-category/category', { name: categoryName }, headers);
  //   alert('Category added');
  //   setCategoryName('');
  // };

  const handleAddCategory = async () => {
  if (!categoryName) return alert('Enter category name');

  try {
    await axios.post('https://career-tool.onrender.com/api/admin-category/category', { name: categoryName }, headers);
    alert('Category added');
    setCategoryName('');
    const res = await axios.get('https://career-tool.onrender.com/api/admin-category/all', headers);
    setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    }
  };

  const handleUploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`https://career-tool.onrender.com/api/admin-category/category/${categoryId}/upload`, formData, headers);
    alert('Questions uploaded');
    setFile(null);
  };

  // const handleUpdateOptions = async () => {
  //   await axios.put(`https://career-tool.onrender.com/api/admin/question/${questionId}/options`, {
  //     options,
  //     correctAnswer
  //   }, headers);
  //   alert('Options saved');
  // };

  // const handleUpdateOptions = async (questionId) => {
  // // Ensure the correct answer is valid (A, B, C, or D)
  // if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
  //   return alert('Please select a valid correct answer (A, B, C, or D)');
  // }

  // try {
  //   await axios.put(
  //     `https://career-tool.onrender.com/api/admin/question/${questionId}/options`,
  //     { options, correctAnswer },
  //     headers
  //   );
  //   alert('Options updated successfully');
  //   // Optionally, reload questions after updating
  //   fetchQuestions();
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to update options');
  //   }
  // };


  const handleUpdateSettings = async () => {
    await axios.put(`https://career-tool.onrender.com/api/admin/test-settings`, settings, headers);
    alert('Test settings updated');
  };
  
  const handleLogout = () => {
    logoutAdmin();  // Log out the user and clear token
    navigate('/admin-login'); // Redirect to login page
  };

  const [viewQuestions, setViewQuestions] = useState([]);

const fetchQuestions = async () => {
  if (!categoryId) return alert('Select a category first');
  try {
    const res = await axios.get(`https://career-tool.onrender.com/api/admin-category/category/${categoryId}/questions`, headers);
    setViewQuestions(res.data);
  } catch (err) {
    console.error(err);
    alert('Failed to load questions');
  }
};

  return (
  <div className="admin-container">
    {/* <button onClick={handleLogout} className="logout-button">Logout</button> */}
    <div className="admin-panel-box">
      <div className="admin-tabs">
        {['category', 'upload', 'settings', 'view', 'delete', 'logout'].map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`admin-tab-btn ${tab === key ? 'active' : ''}`}
          >
            {key === 'category' && 'Add Category'}
            {key === 'upload' && 'Upload Questions'}
            {/* {key === 'options' && 'Add Options'} */}
            {key === 'settings' && 'Test Settings'}
            {key === 'view' && 'View Questions'}
            {key === 'delete' && 'Delete Questions'}
            {key === 'logout' && 'Logout'}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'category' && (
          <>
            <label className="admin-label">New Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="admin-input"
            />
            <button onClick={handleAddCategory} className="admin-button btn-blue">
              Add Category
            </button>
          </>
        )}

        {tab === 'upload' && (
          <>
            <label className="admin-label">Select Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="admin-select"
            >
              <option value="">Select</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <input type="file" onChange={e => setFile(e.target.files[0])} className="admin-input" />
            <button onClick={handleUploadFile} className="admin-button btn-green">
              Upload
            </button>
          </>
        )}

        {/* {tab === 'options' && (
          <>
            <label className="admin-label">Question ID</label>
            <input
              value={questionId}
              onChange={e => setQuestionId(e.target.value)}
              className="admin-input"
            />

            {['A', 'B', 'C', 'D'].map(opt => (
              <div key={opt}>
                <label className="admin-label">{`Option ${opt}`}</label>
                <input
                  value={options[opt]}
                  onChange={e => setOptions({ ...options, [opt]: e.target.value })}
                  className="admin-input"
                />
              </div>
            ))}

            <label className="admin-label">Correct Answer (A/B/C/D)</label>
            <input
              value={correctAnswer}
              onChange={e => setCorrectAnswer(e.target.value)}
              className="admin-input"
            />
            <button onClick={handleUpdateOptions} className="admin-button btn-purple">
              Save Options
            </button>
          </>
        )} */}

        {tab === 'settings' && (
          <>
            <label className="admin-label">Max Questions</label>
            <input
              type="number"
              value={settings.maxQuestions}
              onChange={e => setSettings({ ...settings, maxQuestions: parseInt(e.target.value) })}
              className="admin-input"
            />

            <label className="admin-label">Test Duration (in minutes)</label>
            <input
              type="number"
              value={settings.durationInMinutes}
              onChange={e => setSettings({ ...settings, durationInMinutes: parseInt(e.target.value) })}
              className="admin-input"
            />

            <button onClick={handleUpdateSettings} className="admin-button btn-yellow">
              Update Settings
            </button>
          </>
        )}

        {tab === 'view' && (
        <>
          <label className="admin-label">Select Category</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="admin-select"
          >
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <button onClick={fetchQuestions} className="admin-button btn-blue">
            Load Questions
          </button>

          <div className="question-list">
            {viewQuestions.map((q, index) => (
              <QuestionEditor
                key={q._id}
                question={q}
                index={index}
                headers={headers}
                onSave={fetchQuestions}
                allCategories={categories}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'delete' && (
      <>
        <label className="admin-label">Select Category</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="admin-select"
        >
          <option value="">Select</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <button
          onClick={async () => {
            if (!categoryId) return alert('Please select a category first');
            if (!window.confirm('Are you sure you want to delete all questions in this category?')) return;

            try {
              await axios.delete(`http://localhost:5000/api/admin-category/category/${categoryId}/questions`, headers);
              alert('Questions deleted successfully');
            } catch (err) {
              console.error(err);
              alert('Failed to delete questions');
            }
          }}
          className="admin-button btn-red"
          style={{ marginTop: '1rem' }}
        >
          Delete Questions
        </button>
      </>
      )}
      {tab === 'logout' && (
        <div>
          <h3>Are you sure you want to logout?</h3>
          <button onClick={handleLogout} className="admin-button btn-red">
            Logout
          </button>
        </div>
      )}
      </div>
    </div>
  </div>
  );
}

// function QuestionEditor({ question, index, headers, onSave }) {
//   const [localOptions, setLocalOptions] = useState(question.options || { A: '', B: '', C: '', D: '' });
//   const [localCorrect, setLocalCorrect] = useState(question.correctAnswer || '');

//   const saveOptions = async () => {
//     if (!['A', 'B', 'C', 'D'].includes(localCorrect)) {
//       return alert('Correct Answer must be A, B, C, or D');
//     }
//     try {
//       await axios.put(
//         `https://career-tool.onrender.com/api/admin/question/${question._id}/options`,
//         { options: localOptions, correctAnswer: localCorrect },
//         headers
//       );
//       alert('Options updated successfully');
//       onSave(); // Reload questions
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update options');
//     }
//   };

//   return (
//     <div className="question-boxes">
//       <p><strong>{index + 1}. {question.questionText}</strong></p>

//       {question.options ? (
//         <ul>
//           {Object.entries(question.options).map(([key, val]) => (
//             <li key={key}><strong>{key}:</strong> {val}</li>
//           ))}
//         </ul>
//       ) : (
//         <p style={{ color: 'gray' }}><em>No options provided</em></p>
//       )}
//       <p><strong>Correct Answer:</strong> {question.correctAnswer || 'Not Set'}</p>

//       <div className="update-options-box">
//         <h4>Update Options</h4>

//         {['A', 'B', 'C', 'D'].map(opt => (
//           <div key={opt} className="option-input-group">
//             <label className="admin-label">Option {opt}</label>
//             <input
//               type="text"
//               value={localOptions[opt]}
//               onChange={e => setLocalOptions({ ...localOptions, [opt]: e.target.value })}
//               className="admin-input"
//             />
//           </div>
//         ))}

//         <label className="admin-label">Correct Answer (A/B/C/D)</label>
//         <input
//           type="text"
//           value={localCorrect}
//           onChange={e => setLocalCorrect(e.target.value.toUpperCase())}
//           className="admin-input"
//           maxLength={1}
//         />

//         <button onClick={saveOptions} className="admin-button btn-purple">
//           Save Options
//         </button>
//       </div>
//     </div>
//   );
// }


function QuestionEditor({ question, index, headers, onSave, allCategories }) {
  const [localOptions, setLocalOptions] = useState({
    A: { text: question.options?.A?.text || '', category: question.options?.A?.category || '' },
    B: { text: question.options?.B?.text || '', category: question.options?.B?.category || '' },
    C: { text: question.options?.C?.text || '', category: question.options?.C?.category || '' },
    D: { text: question.options?.D?.text || '', category: question.options?.D?.category || '' },
  });

  const [localCorrect, setLocalCorrect] = useState(question.correctAnswer || '');

  const saveOptions = async () => {
    if (!['A', 'B', 'C', 'D'].includes(localCorrect)) {
      return alert('Correct Answer must be A, B, C, or D');
    }

    try {
      await axios.put(
        `https://career-tool.onrender.com/api/admin/question/${question._id}/options`,
        { options: localOptions, correctAnswer: localCorrect },
        headers
      );
      alert('Options updated successfully');
      onSave(); // Refresh questions
    } catch (err) {
      console.error(err);
      alert('Failed to update options');
    }
  };

  return (
    <div className="question-boxes">
      <p><strong>{index + 1}. {question.questionText}</strong></p>

      {['A', 'B', 'C', 'D'].map((optKey) => (
        <div key={optKey} className="option-input-group">
          <label className="admin-label">Option {optKey} Text</label>
          <input
            type="text"
            value={localOptions[optKey].text}
            onChange={e =>
              setLocalOptions({
                ...localOptions,
                [optKey]: { ...localOptions[optKey], text: e.target.value },
              })
            }
            className="admin-input"
          />

          <label className="admin-label">Option {optKey} Category</label>
          <select
            value={localOptions[optKey].category}
            onChange={e =>
              setLocalOptions({
                ...localOptions,
                [optKey]: { ...localOptions[optKey], category: e.target.value },
              })
            }
            className="admin-select"
          >
            <option value="">Select Category</option>
            {allCategories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      ))}

      <label className="admin-label">Correct Answer (A/B/C/D)</label>
      <input
        type="text"
        value={localCorrect}
        onChange={e => setLocalCorrect(e.target.value.toUpperCase())}
        className="admin-input"
        maxLength={1}
      />

      <button onClick={saveOptions} className="admin-button btn-purple">
        Save Options
      </button>
    </div>
  );
}

