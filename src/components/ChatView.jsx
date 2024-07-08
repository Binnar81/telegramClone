import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, IconButton, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ChatView() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { chatId } = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`);
      
      if (response.data && 
          response.data.status === "success" && 
          Array.isArray(response.data.data)) {
        setMessages(response.data.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    // Implement send message functionality here
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-grow flex flex-col h-full chat-bg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === 1 ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className={`flex max-w-[70%] ${
                message.sender_id === 1 ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <Avatar
                  src={message.sender.email}
                  alt={message.sender.name}
                  className={`w-8 h-8 ${
                    message.sender_id === 1 ? 'mr-2' : 'ml-2'
                  }`}
                />
                <div className={`p-3 rounded-lg ${
                  message.sender_id === 1
                    ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {message.message}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          className="ml-2"
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatView;