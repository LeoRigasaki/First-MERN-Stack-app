import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const Form = () => {
  const [projectName, setProjectName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectProgress, setProjectProgress] = useState(0);
  const [isProjectComplete, setIsProjectComplete] = useState(false);
  const toast = useToast();

  const isFormValid = () => projectName && deadline;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const userID = localStorage.getItem('userID');
    const projectData = { userID, projectName, deadline };

    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST', // or 'PUT' if your API uses PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to add project');
      }

      const responseData = await response.json();
      setProjectProgress(responseData.progress);
      setIsProjectComplete(responseData.progress === 100);
      toast({
        title: 'Project added',
        description: 'Your project has been added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const currentDeadline = new Date(deadline);
    if (currentDeadline < new Date()) {
      setProjectProgress(100);
      setIsProjectComplete(true);
    }
  }, [deadline, toast]);

  return (
    <div style={{ padding: '20px', background: '#E6FFFA', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#319795', marginBottom: '16px' }}>Project Management</h2>

      {isProjectComplete ? (
        <p>Project completed! You can now add a new project.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="projectName" style={{ color: '#2C7A7B' }}>Project Name:</label><br />
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #38B2AC', width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="deadline" style={{ color: '#2C7A7B' }}>Deadline:</label><br />
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #38B2AC', width: '100%' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ background: '#319795', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        <label style={{ color: '#2C7A7B' }}>Project Progress:</label>
        <div style={{ background: '#B2F5EA', height: '20px', borderRadius: '4px', width: '100%' }}>
          <div style={{ background: '#319795', width: `${projectProgress}%`, height: '100%', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Form