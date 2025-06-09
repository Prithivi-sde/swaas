'use client';

import React, { useState, useEffect } from 'react';

interface ProductFormData {
  id?: number;
  title: string;
  description: string;
  thumbnail: string;
}

interface AddProductFormProps {
  onAdd?: (product: any) => void;
  onEdit?: (product: any) => void;
  onClose: () => void;
  initialData?: ProductFormData;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onAdd,
  onEdit,
  onClose,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setThumbnail(initialData.thumbnail);
    }
  }, [initialData]);

  const isEditMode = Boolean(initialData?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData = {
      title,
      description,
      thumbnail,
    };

    try {
      if (isEditMode && initialData?.id) {
        const res = await fetch(`https://dummyjson.com/products/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to update product');
        const updatedProduct = await res.json();
        onEdit?.(updatedProduct);
      } else {
        const res = await fetch('https://dummyjson.com/products/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to add product');
        const newProduct = await res.json();
        onAdd?.(newProduct);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Thumbnail URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? 'Saving...'
                  : 'Adding...'
                : isEditMode
                ? 'Save Changes'
                : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-black"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
