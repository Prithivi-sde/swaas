'use client';

import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { deleteProduct, updateProduct } from '../services/productService';

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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (updated: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onDelete, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
  });

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      onDelete?.(product.id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateProduct(product.id, formState);
      onEdit?.(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="text-yellow-400 text-lg">
        {i < Math.round(rating) ? '★' : '☆'}
      </span>
    ));
  };

  const prevImage = () => {
    if (product.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };
  
  const nextImage = () => {
    if (product.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg w-full max-w-xl p-0 relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Product' : 'Product Details'}
          </h2>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Image Section */}
        <div className="relative p-6 pt-3 pb-1">
          {product.images?.length ? (
            <div className="relative flex justify-center items-center">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="h-48 object-contain"
              />
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                onClick={prevImage}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                onClick={nextImage}
              >
                <FaChevronRight />
              </button>
            </div>
          ) : (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-48 object-contain mx-auto"
            />
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-2 overflow-auto flex-grow">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Thumbnail URL</label>
                <input
                  type="text"
                  value={formState.thumbnail}
                  onChange={(e) => setFormState({ ...formState, thumbnail: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-2">
                <p className="text-lg font-semibold">{product.title}</p>
                <div>{renderStars(product.rating)}</div></div>
              <p className="text-sm mb-2">{product.description}</p>
              <div className="text-sm mb-1">
                <strong>Brand:</strong> {product.brand}{' '}
                <span className="ml-4"></span> {/* adds 1rem left margin */}
                <strong>Category:</strong> {product.category}</div>
              <div className="flex justify-end items-end text-lg font-semibold mb-2">${product.price}</div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between bg-gray-100">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-1"
              >
               Delete
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-black rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
