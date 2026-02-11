import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };

    getProduct();
  }, [id]);

  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  if (!product) {
    return <h2>查無產品</h2>;
  }

  return (
    <div className="container">
      <div className="card" style={{ width: "18rem" }}>
        <img src={product.imageUrl} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p>價格：{product.price}</p>
          <small className="text-body-secondary mb-2">
            單位：{product.unit}
          </small>
          <button
            type="button"
            className="btn btn-primary mt-auto"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
