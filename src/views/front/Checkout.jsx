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
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset, // 引入 reset 以便送出後清空表單
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error(err);
      }
    };
    getProducts();

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.error(err);
      }
    };
    fetchCart();

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }

    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      getCart();
    } catch (error) {
      console.error(err);
    } finally {
      setLoadingCartId(null);
    }
  };

  const updateCart = async (cartId, productId, qty = 1) => {
    setLoadingCartId(cartId);
    try {
      const data = {
        data: {
          product_id: productId,
          qty,
        },
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, data);
      getCart();
    } catch (error) {
      alert(error.response?.data?.message || "更新數量失敗");
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
      alert(error.response?.data?.message || "刪除失敗");
    }
  };

  // 清空購物車加上確認視窗
  const deleteAllCart = async () => {
    if (!window.confirm("確定要清空整個購物車嗎？")) return;

    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      console.error(err);
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
      getCart();
      reset(); // 送出成功後清空表單
    } catch (error) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => deleteAllCart()}
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
                  {/* 改用 value 受控綁定，確保資料刷新後 UI 同步更新 */}
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    value={item.qty}
                    onChange={(e) =>
                      updateCart(
                        item.id,
                        item.product_id,
                        Number(e.target.value),
                      )
                    }
                    disabled={loadingCartId === item.id}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {item.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">
                {loadingCartId === item.id ? (
                  <div
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  ></div>
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

      {/* 結帳表單 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", checkoutRules.email)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", checkoutRules.name)}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", checkoutRules.tel)}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", checkoutRules.address)}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>

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
