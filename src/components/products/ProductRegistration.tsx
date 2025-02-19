import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Product } from '../../types/products';

interface ProductRegistrationProps {
  onProductAdd: (newProduct: Product) => void;
}

const ProductRegistration: React.FC<ProductRegistrationProps> = ({ onProductAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [nameError, setNameError] = useState('');
  const [valueError, setValueError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNameError('');
    setValueError('');
    setQuantityError('');

    if (!name) {
      setNameError('Product Name is required');
      return;
    }

    if (parseFloat(value) <= 0) {
      setValueError('Price must be a positive value');
      return;
    }

    if (parseInt(quantity) < 0) {
      setQuantityError('Quantity must be a non-negative integer');
      return;
    }

    // TODO: Check if the product name is unique

    const newProduct: Product = {
      product_id: Math.random().toString(), // Temporary ID
      name,
      description,
      value: parseFloat(value),
      quantity: parseInt(quantity),
      created_at: new Date().toISOString(),
      min_quantity: 0,
    };

    onProductAdd(newProduct);
    setName('');
    setDescription('');
    setValue('');
    setQuantity('');
    setSuccessMessage('Product added successfully!');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Register Product
      </Typography>
      {successMessage && (
        <Alert severity="success" style={{ marginBottom: '10px' }}>
          {successMessage}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!nameError}
              helperText={nameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              type="number"
              error={!!valueError}
              helperText={valueError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity in Stock"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              type="number"
              error={!!quantityError}
              helperText={quantityError}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductRegistration;
