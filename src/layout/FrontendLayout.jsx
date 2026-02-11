import { NavLink, Outlet } from "react-router";
function FrontendLayout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/product">
              產品頁面
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/checkout">
              結帳頁面
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              登入頁面
            </NavLink>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
export default FrontendLayout;
