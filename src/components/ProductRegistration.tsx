import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Product } from '../types/products';
import { createProduct } from '../services/productsService';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ProductRegistrationProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductRegistration: React.FC<ProductRegistrationProps> = ({ products, setProducts }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !value || !quantity) {
      setError('Please fill in all required fields.');
      return;
    }

    if (parseFloat(value) <= 0) {
      setError('Price must be a positive value.');
      return;
    }

    if (parseInt(quantity) < 0) {
      setError('Quantity must be a non-negative integer.');
      return;
    }

    const newProduct: Product = {
      product_id: uuidv4(),
      name,
      description,
      value: parseFloat(value),
      quantity: parseInt(quantity),
      min_quantity: parseInt(minQuantity),
      created_at: new Date().toISOString(),
    };

    try {
      await createProduct(newProduct);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setName('');
      setDescription('');
      setValue('');
      setQuantity('');
      setMinQuantity('');
      setSuccess('Product created successfully!');
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Register New Product
      </Typography>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity in Stock"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum Quantity"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Register Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductRegistration;
