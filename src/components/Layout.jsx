// Layout.jsx
import { useState, useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, InputBase } from '@mui/material';
import { Menu as MenuIcon, DarkMode, ArrowBack, Search as SearchIcon } from '@mui/icons-material';
import { debounce } from 'lodash';
import Sidebar from './Sidebar';
import ChatView from './ChatView';

function Layout({ darkMode, setDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    const term = event.target.value;
    handleSearch(term);
  };

  const drawerContent = (
    <div className="w-64">
      <List>
        <ListItem>
          <ListItemIcon><DarkMode /></ListItemIcon>
          <ListItemText primary="Dark Mode" />
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </ListItem>
      </List>
    </div>
  );

  const isChatRoute = location.pathname.startsWith('/chat/');

  return (
    <div className="h-screen flex flex-col">
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={isChatRoute ? () => navigate('/') : toggleDrawer(true)}
          >
            {isChatRoute ? <ArrowBack /> : <MenuIcon />}
          </IconButton>
          <div className="flex-grow flex items-center bg-white bg-opacity-20 rounded mx-2">
            <SearchIcon className="mx-2 text-gray-300" />
            <InputBase
              placeholder="Search chats..."
              className="flex-grow text-white"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <div className="flex-grow flex overflow-hidden">
        <div className="md:w-80 md:flex-shrink-0 md:border-r border-gray-200 dark:border-gray-700 md:block">
          <Sidebar searchTerm={searchTerm} />
        </div>
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/chat/:chatId" element={<ChatView />} />
            <Route path="/" element={
              <div className="flex items-center justify-center h-full text-gray-500 md:block">
                <span className="hidden md:inline">Select a chat to start messaging</span>
                <div className="md:hidden">
                  <Sidebar searchTerm={searchTerm} />
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Layout;