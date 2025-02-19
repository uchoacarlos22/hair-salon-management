import React, { useState, useEffect } from 'react';
import ProductRegistration from './ProductRegistration';
import ProductsList from './ProductsList';
import ProductEditForm from './products/ProductEditForm';
import { Product } from '../types/products';
import { getProducts } from '../services/productsService';

interface ProductsDashboardProps {}

const ProductsDashboard: React.FC<ProductsDashboardProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getProducts();
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <ProductRegistration products={products} setProducts={setProducts} />
      <ProductsList
        products={products}
        setProducts={setProducts}
        setSelectedProduct={setSelectedProduct}
        handleOpen={handleOpen}
      />
      {selectedProduct && (
        <ProductEditForm
          open={open}
          handleClose={handleClose}
          product={selectedProduct}
          setProducts={setProducts}
          products={products}
        />
      )}
    </div>
  );
};

export default ProductsDashboard;
