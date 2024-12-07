import React, { useState } from 'react';
import axiosInstance from '../helpers/axios_config';
import { ChevronRight } from 'lucide-react';

const AssignmentList = ({ assignments, setAssignments }) => {
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);

  const handleCheckboxChange = async (assignmentId) => {
    try {
      const updatedAssignments = assignments.map((assignment) => 
        assignment._id === assignmentId
          ? { ...assignment, isDone: !assignment.isDone }
          : assignment
      );
      setAssignments(updatedAssignments);

      const updatedAssignment = updatedAssignments.find(a => a._id === assignmentId);
      await axiosInstance.put(`/api/assignments/${assignmentId}`, { isDone: updatedAssignment.isDone });
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const toggleDetails = (assignmentId) => {
    setExpandedAssignmentId(expandedAssignmentId === assignmentId ? null : assignmentId);
  };

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="text-gray-400 text-lg">No assignments available</div>
        <div className="text-gray-400 text-sm mt-2">Create new assignments to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className={`bg-white rounded-lg shadow-sm border transition-all duration-200 
            ${assignment.isDone ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'}`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={assignment.isDone}
                  onChange={() => handleCheckboxChange(assignment._id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              
              <div 
                className="flex-grow cursor-pointer flex items-center space-x-3"
                onClick={() => toggleDetails(assignment._id)}
              >
                <ChevronRight 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200
                    ${expandedAssignmentId === assignment._id ? 'rotate-90' : ''}`}
                />
                <span className={`text-lg ${assignment.isDone ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {assignment.name}
                </span>
              </div>
            </div>

            {expandedAssignmentId === assignment._id && (
              <div className="mt-4 ml-12 pl-4 border-l-2 border-gray-200">
                <div className="text-gray-600 text-sm leading-relaxed">
                  {assignment.details || 'No details provided.'}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Last updated: {new Date(assignment.timestamp).toDateString()+ ", " + new Date(assignment.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;