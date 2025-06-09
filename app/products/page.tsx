'use client';

import React, { useEffect, useState } from 'react';
import AddProductForm from '../components/AddProductForm';
import { Header } from '../components/header/Header';
import ProductModal from '../components/ProductModal';
import { fetchProducts } from '../services/productService';

interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  brand?: string;
  category?: string;
  price?: number;
  images?: string[];
}

const ITEMS_PER_PAGE = 8;

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sort === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(start, start + ITEMS_PER_PAGE);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const updated = [{ id, ...newProduct }, ...products];
    setProducts(updated);
  };

  const handleProductDeleted = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedProduct(null);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setSelectedProduct(updatedProduct);
  };

  const openEditModal = () => {
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <Header productCount={products.length} />

      <div className="p-8">
        {/* Controls: Search, Sort, Add */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <span className="text-2xl font-semibold">Product List</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-col">
            <span className="text-xs text-gray-600 mb-1">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-5 py-2 border rounded-md shadow-sm text-sm focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() => {
              setShowAddModal(true);
              setSelectedProduct(null);
              setShowEditModal(false);
            }}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded"
          >
            Add
          </button>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer border p-4 rounded shadow-sm hover:shadow-md flex flex-col"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h2 className="font-medium text-lg">{product.title}</h2>
                    <p className="text-sm text-gray-600 mb-2 flex-grow">{product.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 col-span-full">No products to display</div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded border ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <AddProductForm
            onAdd={handleAddProduct}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <AddProductForm
            initialData={{
              title: selectedProduct.title,
              description: selectedProduct.description,
              thumbnail: selectedProduct.thumbnail,
            }}
            onEdit={async (data) => {
              const updatedProduct = { ...selectedProduct, ...data };
              handleProductUpdated(updatedProduct);
              closeEditModal();
            }}
            onClose={closeEditModal}
          />
        )}

        {/* Product Detail Modal */}
        {selectedProduct && !showEditModal && (
          <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDelete={handleProductDeleted}  
          onEdit={handleProductUpdated}  
        />
        )}
      </div>
    </>
  );
};

export default ProductPage;
