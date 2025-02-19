import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TablePagination,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Product } from '../types/products';
import { Dispatch, SetStateAction } from 'react';
import { deleteProduct } from '../services/productsService';

interface ProductsListProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setSelectedProduct: (product: Product | null) => void;
  handleOpen: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, setProducts, setSelectedProduct, handleOpen }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = products.filter((product) => product.product_id !== productId);
      setProducts(updatedProducts);
      setAlert({ severity: 'success', message: 'Product deleted successfully!' });

      // Adjust page if needed
      if (updatedProducts.length % rowsPerPage === 0 && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlert({ severity: 'error', message: 'Failed to delete product.' });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    handleOpen();
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Product List
      </Typography>
      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)} style={{ marginBottom: '10px' }}>
          {alert.message}
        </Alert>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Min Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.value}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.min_quantity}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(product.product_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductsList;
