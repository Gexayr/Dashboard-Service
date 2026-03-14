import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRules, createRule, updateRule, deleteRule, toggleRule } from '../api/rules';
import './Rules.css';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const navigate = useNavigate();

  const initialFormState = {
    rule_name: '',
    event_type: 'withdrawal',
    condition_field: 'amount',
    condition_operator: '>',
    condition_value: '',
    score: '',
    enabled: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRules();
      setRules(response.data || []);
    } catch (err) {
      setError('Failed to fetch rules. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setCurrentRule(rule);
      setFormData({
        rule_name: rule.rule_name,
        rule_value: rule.rule_value,
        event_type: rule.event_type,
        condition_field: rule.condition_field,
        condition_operator: rule.condition_operator,
        condition_value: rule.condition_value,
        score: rule.score,
        enabled: rule.enabled
      });
    } else {
      setCurrentRule(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRule(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        score: parseInt(formData.score, 10)
      };

      if (currentRule) {
        await updateRule(currentRule.id, payload);
      } else {
        await createRule(payload);
      }
      fetchRules();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save rule. Please check your input.');
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleRule(id);
      setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    } catch (err) {
      console.error('Failed to toggle rule:', err);
      alert('Failed to toggle rule status.');
    }
  };

  const confirmDelete = (rule) => {
    setRuleToDelete(rule);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await deleteRule(ruleToDelete.id);
      fetchRules();
      setIsDeleteModalOpen(false);
      setRuleToDelete(null);
    } catch (err) {
      console.error('Failed to delete rule:', err);
      alert('Failed to delete rule.');
    }
  };

  return (
    <div className="rules-page">
      <header className="rules-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            &larr; Back
          </button>
          <h1>Rules Management</h1>
        </div>
        <button className="create-btn" onClick={() => handleOpenModal()}>
          Create Rule
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="rules-table-container">
        {loading ? (
          <div className="loading-state">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="empty-state">No rules found. Create one to get started.</div>
        ) : (
          <table className="rules-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Event Type</th>
                <th>Condition</th>
                <th>Score</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id}>
                  <td>{rule.rule_name}</td>
                  <td>{rule.event_type}</td>
                  <td>{`${rule.condition_field} ${rule.condition_operator} ${rule.condition_value}`}</td>
                  <td>{rule.score > 0 ? `+${rule.score}` : rule.score}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={rule.enabled} 
                        onChange={() => handleToggle(rule.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleOpenModal(rule)}>Edit</button>
                    <button className="delete-btn" onClick={() => confirmDelete(rule)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentRule ? 'Edit Rule' : 'Create Rule'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  name="rule_name"
                  value={formData.rule_name}
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Large Withdrawal"
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select name="event_type" value={formData.event_type} onChange={handleInputChange}>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="login">Login</option>
                  <option value="transfer">Transfer</option>
                  <option value="deposit">Deposit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Condition Field</label>
                <input 
                  name="condition_field" 
                  value={formData.condition_field} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. amount"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Operator</label>
                  <select name="condition_operator" value={formData.condition_operator} onChange={handleInputChange}>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="=">=</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="!=">!=</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Value</label>
                  <input 
                    name="condition_value"
                    value={formData.condition_value}
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Score</label>
                <input 
                  type="number" 
                  name="score" 
                  value={formData.score}
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. 70"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ marginBottom: 0 }}>Enabled</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="enabled" 
                    checked={formData.enabled} 
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h2>Delete Rule</h2>
            <p>Are you sure you want to delete the rule <strong>{ruleToDelete?.name}</strong>?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="save-btn" style={{ backgroundColor: '#e74c3c' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;
