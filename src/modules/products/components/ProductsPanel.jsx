import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../../../store/productsSlice';

const ProductsPanel = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Products</h3>
      {status === 'loading' && <p>Loading products...</p>}
      {status === 'failed' && <p className="text-red-500">Failed to load products.</p>}
      <ul className="list-disc list-inside">
        {products && products.length > 0 ? (
          products.map((p) => (
            <li key={p.id}>{p.name} {p.brand ? `— ${p.brand}` : ''}</li>
          ))
        ) : (
          status === 'succeeded' && <li>No products found.</li>
        )}
      </ul>
    </div>
  );
};

export default ProductsPanel;
