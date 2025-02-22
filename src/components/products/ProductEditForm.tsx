import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { Product } from '../../types/products';
import { updateProduct } from '../../services/productsService';
import { Dispatch, SetStateAction } from 'react';

interface ProductEditFormProps {
  open: boolean;
  handleClose: () => void;
  product: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  products: Product[];
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ open, handleClose, product, setProducts, products }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [min_quantity, setMinQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setValue(String(product.value));
      setQuantity(String(product.quantity));
      setMinQuantity(String(product.min_quantity));
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, handleClose]);

  const validateForm = () => {
    if (!name || !value || !quantity || !min_quantity) {
      setError('All fields are required');
      return false;
    }

    if (isNaN(Number(value)) || Number(value) <= 0) {
      setError('Price must be a positive number');
      return false;
    }

    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      setError('Quantity must be a non-negative number');
      return false;
    }
    if (isNaN(Number(min_quantity)) || Number(min_quantity) < 0) {
      setError('Min Quantity must be a non-negative number');
      return false;
    }

    if (products.find((p) => p.name === name && p.product_id !== product?.product_id)) {
      setError('Product name must be unique');
      return false;
    }

    setError('');
    return true;
  };


  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!product) {
      return;
    }

    const updatedProduct = {
      ...product,
      name,
      description,
      value: Number(value),
      quantity: Number(quantity),
      min_quantity: Number(min_quantity),
    };

    try {
      await updateProduct(product.product_id, updatedProduct);
      setProducts(products.map((p) => (p.product_id === product.product_id ? updatedProduct : p)));
      setSuccess('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
       {error && (
          <Alert severity="error" style={{ marginBottom: '10px' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" style={{ marginBottom: '10px' }}>
            {success}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Grid>
           <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Min Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={min_quantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditForm;
