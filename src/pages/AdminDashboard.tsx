import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import LogoutButton from '../components/LogoutButton';
import ProfessionalsManagement from '../components/ProfessionalsManagement';
import History from '../components/History';
import ProductsDashboard from '../components/ProductsDashboard';
import { useDrawerToggle } from '../hooks/useDrawerToggle';

const drawerWidth = 240;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mobileOpen, handleDrawerToggle } = useDrawerToggle();

  const drawer = (
    <Box sx={{ mt: isMobile ? 8 : 0 }}>
      {isMobile && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/admin-dashboard/professionals-management"
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>
              <PlaylistAddCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Gestão de Colaboradores" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/admin-dashboard/history"
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>
              <PlaylistAddCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Historico geral de serviços prestados" />
          </ListItemButton>
        </ListItem>
        {/* Outras opções de menu podem ser adicionadas aqui */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/admin-dashboard/products"
            onClick={() => isMobile && handleDrawerToggle()}
          >
            <ListItemIcon>
              <PlaylistAddCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Produtos" />
          </ListItemButton>
        </ListItem>
        <LogoutButton />
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer para dispositivos móveis */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhora o desempenho em mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer permanente para telas maiores */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 4, // Espaço para o AppBar
        }}
      >
        <Routes>
          <Route
            path="/professionals-management"
            element={<ProfessionalsManagement />}
          />
          <Route path="/history" element={<History userRole="admin" />} />
          <Route path="/products" element={<ProductsDashboard />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
