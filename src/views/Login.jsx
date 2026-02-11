import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router"; // 引用導航功能
import "../assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const navigate = useNavigate(); // 初始化 navigate

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "a876d734@gmail.com",
      password: "",
    },
  });

  useEffect(() => {
    // 檢查是否有 Token，若已有 Token 且驗證成功，可直接導向首頁
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    if (token) {
      axios.defaults.headers.common.Authorization = token;
      checkAdmin();
    }
  }, []);

  // 驗證登入狀態，若已登入則導向首頁
  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      navigate("/"); // 已登入，跳轉至首頁
    } catch (err) {
      console.log("未登入或 Token 失效");
    }
  };

  // 執行登入
  const onLoginSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;

      // 儲存 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;

      alert("登入成功");
      navigate("/"); // 登入成功，跳轉至首頁
    } catch (error) {
      alert("登入失敗：" + (error.response?.data?.message || "請檢查帳號密碼"));
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center">後台管理登入</h1>
        <div className="col-8">
          <form
            id="form"
            className="form-signin"
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                {...register("username", {
                  required: "請輸入Email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email格式不正確",
                  },
                })}
              />
              <label htmlFor="username">Email address</label>
              {errors.username && (
                <p className="text-danger">{errors.username.message}</p>
              )}
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: "請輸入密碼",
                  minLength: {
                    value: 6,
                    message: "密碼長度至少6碼",
                  },
                })}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              disabled={!isValid}
            >
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted text-center">
        &copy; 2024~∞ - 六角學院
      </p>
    </div>
  );
}

export default Login;
