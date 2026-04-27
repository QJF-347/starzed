import React from 'react';

// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Cache products data
let productsCache = null;
let productsPromise = null;

export const getProducts = async () => {
  if (productsCache) {
    return productsCache;
  }
  
  if (!productsPromise) {
    productsPromise = fetchProducts();
  }
  
  try {
    productsCache = await productsPromise;
    return productsCache;
  } finally {
    productsPromise = null;
  }
};

// Legacy export for backward compatibility
export const products = [];

// Dynamic import function that fetches from API
export const useProducts = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  return { products, loading };
};
