import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Product } from '../types/products';
import { Dispatch, SetStateAction } from 'react';
import { updateProduct } from '../services/productsService';

interface ProductEditFormProps {
  product: Product;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
  handleClose: () => void;
  minQuantity: number;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ product, setProducts, setSelectedProduct, handleClose }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [value, setValue] = useState(product.value);
  const [quantity, setQuantity] = useState(product.quantity);
  const [minQuantity, setMinQuantity] = useState(product.min_quantity);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedProduct = {
        name,
        description,
        value,
        quantity,
        min_quantity: minQuantity,
      };

      const updatedProductFromDB = await updateProduct(product.product_id, updatedProduct);

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.product_id === product.product_id ? updatedProductFromDB : p))
      );
      setSelectedProduct(null);
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    handleClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Edit Product</Typography>
      <TextField
        label="Name"
        fullWidth
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Price"
        fullWidth
        required
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        margin="normal"
      />
      <TextField
        label="Quantity"
        fullWidth
        required
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        margin="normal"
      />
       <TextField
        label="Minimum Quantity"
        fullWidth
        required
        type="number"
        value={minQuantity}
        onChange={(e) => setMinQuantity(parseInt(e.target.value))}
        margin="normal"
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={handleCancel} variant="contained" color="secondary" sx={{ ml: 2 }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProductEditForm;
