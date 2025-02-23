"use client";
import { useState, useEffect } from "react";

export default function Home() {
  // FastAPI の /hello からのメッセージ取得用
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [helloMessage, setHelloMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/hello`)
      .then((res) => res.json())
      .then((data) => setHelloMessage(data.message))
      .catch((err) => console.error("Error:", err));
  }, [API_URL]);

  // POSシステム用のコンポーネント
  function POSApp() {
    const [productCode, setProductCode] = useState("");
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [checkoutMessage, setCheckoutMessage] = useState("");

    // 商品情報を取得
    const fetchProduct = async () => {
      try {
        setErrorMessage("");
        const response = await fetch(`${API_URL}/products/${productCode}`);
        if (!response.ok) {
          throw new Error("商品が見つかりません");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    // カートに商品を追加
    const addToCart = async () => {
      if (!product) return;
      try {
        const response = await fetch(`${API_URL}/cart/add/${product.code}`, { method: "POST" });
        const data = await response.json();
        setCart(data.cart);
        fetchCartTotal(); // 合計金額更新
      } catch (error) {
        console.error("カート追加エラー:", error);
      }
    };

    // カートの中身を取得
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/cart/`);
        const data = await response.json();
        setCart(data.cart);
      } catch (error) {
        console.error("カート取得エラー:", error);
      }
    };

    // カートの合計金額を取得
    const fetchCartTotal = async () => {
      try {
        const response = await fetch(`${API_URL}/cart/total`);
        const data = await response.json();
        setTotal(data.total_price);
      } catch (error) {
        console.error("合計金額取得エラー:", error);
      }
    };

    // 会計処理（取引作成）のハンドラー
    const handleCheckout = async () => {
      // カート内の商品を { product_code, quantity } の形式に変換
      const cartItems = cart.map((item) => ({
        product_code: item.code,
        quantity: 1, // 現状は数量1として固定
      }));
      try {
        const response = await fetch(`${API_URL}/transactions/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_items: cartItems }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("会計エラー:", response.status, errorText);
          throw new Error("会計処理に失敗しました");
        }

        const result = await response.json();
        setCheckoutMessage(
          `取引完了！取引ID: ${result.transaction_id}, 合計金額: ${result.total_amount}`
        );
        setCart([]);
        setTotal(0);
      } catch (error) {
        console.error("会計エラー:", error);
        setCheckoutMessage(error.message);
      }
    };

    useEffect(() => {
      fetchCart();
      fetchCartTotal();
    }, []);

    return (
      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">POSシステム</h1>

        {/* 商品コード入力 & 読み込み */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="商品コード"
            className="border p-2"
          />
          <button onClick={fetchProduct} className="bg-blue-500 text-white px-4 py-2">
            商品コード 読み込み
          </button>
          <button onClick={addToCart} className="bg-green-500 text-white px-4 py-2">
            追加
          </button>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* 選択した商品情報 */}
        {product && (
          <div className="border p-4 w-1/2 mt-4">
            <h2 className="text-lg font-bold">商品情報</h2>
            <p>商品名: {product.name}</p>
            <p>価格: {product.price}円</p>
          </div>
        )}

        {/* カート表示 */}
        <div className="mt-6 border p-4 w-1/2">
          <h2 className="text-lg font-bold">購入リスト</h2>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <p key={index}>
                {item.name} × 1 {item.price}円
              </p>
            ))
          ) : (
            <p>カートに商品がありません</p>
          )}
        </div>

        {/* 合計金額 */}
        <div className="mt-6 text-xl font-bold">
          購入合計金額: {total}円（税込）
        </div>

        {/* 会計ボタン */}
        <div className="mt-6">
          <button onClick={handleCheckout} className="bg-red-500 text-white px-4 py-2">
            会計
          </button>
        </div>

        {checkoutMessage && <p className="mt-4 text-green-600">{checkoutMessage}</p>}
      </div>
    );
  }

  return (
    <div>
      {/* FastAPI /hello エンドポイントからのメッセージ */}
      <div className="p-8">
        <h1>Next.js と FastAPI の連携確認</h1>
        <p>FastAPI からのメッセージ: {helloMessage}</p>
      </div>
      {/* POSシステムのコンポーネント */}
      <POSApp />
    </div>
  );
}


