// Sidebar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, CircularProgress } from '@mui/material';

function Sidebar({ searchTerm }) {
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, [page]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://devapi.beyondchats.com/api/get_all_chats?page=${page}`);
      
      if (response.data &&
          response.data.status === "success" &&
          response.data.data &&
          Array.isArray(response.data.data.data)) {
        setChats(prevChats => [...prevChats, ...response.data.data.data]);
        setHasMore(page < response.data.data.last_page);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Error fetching chats');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!chat || !chat.creator) return false;
    const creatorName = chat.creator.name || '';
    return creatorName.toLowerCase().includes((searchTerm || '').toLowerCase()) 
  });

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col h-full">
      <List className="flex-grow overflow-y-auto">
        {filteredChats.map(chat => (
          <ListItem
            key={chat.id}
            button
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ListItemAvatar>
              <Avatar src={chat.creator?.email} alt={chat.creator?.name || 'Not Found'} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.creator?.name ||  'Not Found'}
              secondary={`Messages: ${chat.msg_count}`}
              secondaryTypographyProps={{ noWrap: true }}
            />
          </ListItem>
        ))}
      </List>
      {hasMore && (
        <div className="p-2 flex justify-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;