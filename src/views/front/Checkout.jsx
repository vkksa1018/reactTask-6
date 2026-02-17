import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { currency } from "../../utiles/filter";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";
import { checkoutRules } from "../../utiles/formValidation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({
    carts: [],
    total: 0,
    final_total: 0,
  });
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);

  // 解構出 reset 用於清空表單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error("取得購物車失敗", error);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    getProducts();
    getCart();

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const modalElement = document.querySelector("#productModal");
    const handleHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    modalElement.addEventListener("hide.bs.modal", handleHide);
    return () => modalElement.removeEventListener("hide.bs.modal", handleHide);
  }, []);

  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
      productModalRef.current.show();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: id, qty },
      });
      getCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCartId(null);
    }
  };

  const updateCart = async (cartId, productId, qty = 1) => {
    if (qty < 1) return;
    setLoadingCartId(cartId);
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {
        data: { product_id: productId, qty },
      });
      getCart();
    } catch (error) {
      alert("更新數量失敗");
    } finally {
      setLoadingCartId(null);
    }
  };

  const delCart = async (cartId, title) => {
    if (!window.confirm(`確定要將「${title}」從購物車移除嗎？`)) return;
    setLoadingCartId(cartId);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      getCart();
    } catch (error) {
      alert("刪除失敗");
    } finally {
      setLoadingCartId(null);
    }
  };

  const deleteAllCart = async () => {
    // 加入清空購物車確認視窗
    if (!window.confirm("確定要清空購物車內所有商品嗎？")) return;

    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (formData) => {
    if (cart.carts.length === 0) {
      alert("購物車內目前沒有商品，請先去挑選旅遊行程喔！");
      return;
    }
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, { data });
      alert("訂單已成功送出！");
      reset(); // 成功送出後清空表單
      getCart();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container">
      {/* 產品列表表格部分保持不變，略過以節省篇幅 */}
      {/* ... */}

      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={deleteAllCart}
          disabled={cart.carts.length === 0}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量 / 單位</th>
            <th className="text-end">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart.carts.map((item) => (
            <tr key={item.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(item.id, item.product.title)}
                >
                  刪除
                </button>
              </td>
              <td>{item.product.title}</td>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={item.qty} // 修改為 value 綁定
                    onChange={(e) =>
                      updateCart(
                        item.id,
                        item.product_id,
                        Number(e.target.value),
                      )
                    }
                    disabled={loadingCartId === item.id}
                  />
                  <span className="input-group-text">{item.product.unit}</span>
                </div>
              </td>
              <td className="text-end">
                {loadingCartId === item.id ? (
                  <div className="spinner-border spinner-border-sm text-secondary"></div>
                ) : (
                  currency(item.final_total)
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>

      {/* 結帳表單部分 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          {/* 表單各項 input */}
          {/* ... */}
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cart.carts.length === 0}
            >
              {cart.carts.length === 0 ? "請先加入商品" : "送出訂單"}
            </button>
          </div>
        </form>
      </div>

      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Checkout;
