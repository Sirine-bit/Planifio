import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Check, CheckCheck } from 'lucide-react';
import { Avatar } from '../components/avatar.jsx';
import axiosInstance from '../helpers/axios_config';
import PropTypes from 'prop-types';
import { useAuth } from '../helpers/wrapper';

// Main Chat Modal Component
const ChatModal = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user, organizationMembers } = useAuth();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/api/conversations');
      setConversations(response.data);
      console.log(response.data);
      const members = organizationMembers
                      .filter(member => !response.data
                          .some(conversation => 
                            conversation.participants[0]._id === member._id));

      console.log(members);
      setMembers(members);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const createConversation = async (memberId) => {
    try {
      const response = await axiosInstance.post('/api/conversations', {
        participantId: memberId
      });
      await fetchConversations();
      selectConversation(response.data);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(`/api/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axiosInstance.post(`/api/conversations/${selectedConversation._id}/messages`, {
        content: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations(); // Refresh conversation list to update last message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  return (
    <div className={`fixed bottom-0 right-4 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-t-lg shadow-lg w-128 h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`p-3 hover:bg-gray-100 cursor-pointer ${
                  selectedConversation?._id === conversation._id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Avatar
                    imageUrl={conversation.participants[0]?.profileImage}
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.participants[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                  {!conversation.lastMessage?.seen && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
            {members && members.map((member) => (
            <div
              key={member._id}
              onClick={() => createConversation(member._id)}
              className={`p-3 hover:bg-gray-100 cursor-pointer ${
                selectedConversation?._id === member._id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <Avatar
                  imageUrl={member.profileImage ?? '../../public/assets/profile.png'}
                  size="sm"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Start a conversation
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      imageUrl={selectedConversation.participants[0]?.profileImage}
                      size="sm"
                    />
                    <span className="font-medium">
                      {selectedConversation.participants[0]?.name}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex mb-3 ${
                        message.sender === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          {message.sender === user.id && (
                            <span>
                              {message.seen ? (
                                <CheckCheck className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatModal;