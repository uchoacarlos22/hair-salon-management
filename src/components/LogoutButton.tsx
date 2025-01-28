import React from 'react';
    import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '../services/supabaseClient';

    const LogoutButton = () => {
      const [open, setOpen] = React.useState(false);
      const navigate = useNavigate();

      const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
      };

      return (
        <div>
          <Button color="inherit" onClick={handleClickOpen}>
            Logout
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Deseja realmente sair?'}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleLogout} color="primary" autoFocus>
                Sair
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    export default LogoutButton;
