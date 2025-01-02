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
      fetchConversations(true);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async (firstTime = false) => {
    try {
      const response = await axiosInstance.get('/api/conversations');
      setConversations(response.data);
      const members = organizationMembers
                      .filter(member => !response.data
                        .some(conversation => 
                          conversation.participants.some(participant => 
                            participant._id === member._id
                          )
                        )
                      );

      setMembers(members);
      if (firstTime) {
        await selectConversation(response.data[0]);
      }
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
      fetchConversations();
      axiosInstance.post('/api/notifications', {
        recipientId: selectedConversation.participants.find(
          participant => participant._id !== user.id
        )._id,
        content: user.username + ' sent you a message',
        severity: 'low',
        instigatorId: user.id,
        instigatorImage: user.profileImage
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  console.log('members:', conversations);

  const selectConversation = async (conversation) => {
    await fetchMessages(conversation._id);
    setSelectedConversation(conversation);
  };

  return (
    <div className={`fixed bottom-0 right-4 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-t-lg shadow-lg w-[600px] h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-1 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold w-full text-[aliceBlue]">Pings</h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {conversations && conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`p-3 hover:bg-gray-100 cursor-pointer ${
                  selectedConversation?._id === conversation._id ? 'bg-gray-300' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Avatar
                    imageUrl={conversation.participants.find(
                      participant => participant._id !== user.id
                    )?.profileImage ?? '../src/assets/profile.png'}
                    size="sm"
                    className='flex-shrink-0'
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.participants.find(
                      participant => participant._id !== user.id
                    )?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage ? conversation.lastMessage?.content : 'Start a conversation'}
                    </p>
                  </div>
                  {!conversation.lastMessage?.seen && (conversation.lastMessage?.sender._id == user.id) && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
            {members && members.map((member) => (
            <div
              key={member._id}
              role='button'
              onClick={() => createConversation(member._id)}
              className={'p-3 hover:bg-gray-100 cursor-pointer'}
            >
              <div className="flex items-center space-x-2">
                <Avatar
                  imageUrl={member.profileImage ?? '../src/assets/profile.png'}
                  size="sm"
                  className='flex-shrink-0'
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
                <div className='flex flex-col overflow-y-auto h-[500px]'>
                  <div className="p-3 border-b">
                    <div className="w-full flex items-center justify-center flex-col space-x-2">
                    <Avatar
                        imageUrl={selectedConversation.participants.find(
                          participant => participant._id !== user.id
                        )?.profileImage}
                        size="xlg"
                      />
                      <span className="font-bold">
                        {selectedConversation.participants?.find(
                          participant => participant._id !== user.id
                        )?.username}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-2">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No messages yet
                        </div>
                        )}
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
                          <p className="text-sm max-w-[200px]">{message.content}</p>
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

                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-2 border-t pb-1">
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