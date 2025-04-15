import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TrophyIcon, XMarkIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { challengesApi } from '../services/api';

const ChallengeModal = ({ isOpen, onClose }) => {
  const [creating, setCreating] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  const { username, score } = useSelector(state => state.user);
  
  if (!isOpen) return null;
  
  const createChallenge = async () => {
    try {
      setCreating(true);
      setError(null);
      
      const challenge = await challengesApi.createChallenge(username);
      
      // Create the challenge URL with the base URL and the challenge ID
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/challenge/accept/${challenge.challenge_id}`;
      
      setChallengeUrl(url);
      setCreating(false);
    } catch (err) {
      console.error('Error creating challenge:', err);
      setError('Failed to create challenge. Please try again.');
      setCreating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(challengeUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        setError('Failed to copy to clipboard. Please try manually selecting and copying the URL.');
      });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
            Challenge Your Friends
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Challenge your friends to beat your score of <span className="font-bold text-blue-600">{score}</span>!
            </p>
            
            {!challengeUrl ? (
              <button
                onClick={createChallenge}
                disabled={creating}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md w-full flex items-center justify-center"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Challenge...
                  </>
                ) : (
                  'Create Challenge Link'
                )}
              </button>
            ) : (
              <div className="space-y-5">
                <div className="text-left">
                  <p className="text-sm text-gray-500 mb-1">Challenge Link:</p>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={challengeUrl}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md ${
                        copied ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {copied ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <ClipboardIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700">
                  <p>
                    Share this link with your friends to challenge them! When they click it, they'll see
                    your score and can accept the challenge to compete against you.
                  </p>
                </div>
                
                <button
                  onClick={createChallenge}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md w-full"
                >
                  Create New Challenge
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal; 