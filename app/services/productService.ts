type Product = {
    id: number;
    name: string;
    price: number;
    description?: string;
  };

  export const fetchProducts = async () => {
    const res = await fetch('https://dummyjson.com/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products;  
  };
  
  export const createProduct = async (url: string, data: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  };  

export const deleteProduct = async (id: number) => {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  };
  
  export const updateProduct = async (id: number, data: Partial<Product>) => {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  };
  