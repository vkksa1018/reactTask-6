import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">糟了！這個頁面就像過期的機票，回不去了。</p>
      <p className="text-muted">{countdown} 秒後將自動帶您回到首頁...</p>
      <Link to="/" className="btn btn-primary">
        立即手動回首頁
      </Link>
    </div>
  );
}

export default NotFound;
