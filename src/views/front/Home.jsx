import { Link } from "react-router"; // 確保引用 react-router 的 Link

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div
        className="p-5 mb-4 bg-dark text-white rounded-3 d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1729188430376-e3908f87e7f0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
        }}
      >
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">探索未知的旅程</h1>
          <p className="col-md-8 fs-4 mx-auto">
            精選全球熱門旅遊景點，為您打造獨一無二的旅行回憶。從秘境探險到城市漫遊，現在就出發！
          </p>
          <Link
            to="/product"
            className="btn btn-primary btn-lg px-5 mt-3 shadow"
          >
            立即查看旅遊行程
          </Link>
        </div>
      </div>

      {/* 特色介紹 */}
      <div className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-compass fs-1 text-primary"></i>
              <h3 className="mt-2">精選路線</h3>
              <p>我們親自走訪每一處景點，只為提供最棒的體驗。</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-shield-check fs-1 text-primary"></i>
              <h3 className="mt-2">安全保障</h3>
              <p>全程投保高額旅遊險，讓您玩得開心又安心。</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-wallet2 fs-1 text-primary"></i>
              <h3 className="mt-2">透明價格</h3>
              <p>絕無額外隱藏費用，給您最高的旅遊 CP 值。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
