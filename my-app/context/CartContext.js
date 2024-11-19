import { createContext, useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // 從資料庫獲取購物車資料
  useEffect(() => {
    const fetchCart = async () => {
      if (userEmail) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/user/${userEmail}`
          );
          const data = await response.json();
          if (response.ok && data.cart) {
            setCartItems(data.cart);
          }
        } catch (e) {
          console.error("獲取購物車資料失敗", e);
        }
      }
    };
    fetchCart();
  }, [userEmail]);

  // 加入購物車
  const addToCart = async (commodityId, count) => {
    if (!userEmail) {
      alert("請先登入");
      return false;
    }
    //先檢查購物車是否已有該商品 前端部分也要先更新不然會有bug
    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.commodityId === commodityId
      );
      let newCartItems;
      if (existingItemIndex !== -1) {
        newCartItems = cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              count: item.count + count,
            };
          }
          return item;
        });
      } else {
        newCartItems = [...cartItems, { commodityId, count }];
      }
      //給後端更新資料庫
      const response = await fetch("http://localhost:5000/api/addCart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          commodityId,
          count,
        }),
      });

      if (response.ok) {
        setCartItems(newCartItems);
        return true;
      }
    } catch (e) {
      console.error("加入購物車失敗", e);
      return false;
    }
  };

  //修改購物車商品數量
  const updateCartItemCount = async (commodityId, newCount) => {
    if (!userEmail || newCount < 0) return false;
    try {
      const response = await fetch("http://localhost:5000/api/updateCart", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userEmail, commodityId, count: newCount }),
      });
      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.commodityId === commodityId
              ? { ...item, count: newCount }
              : item
          )
        );
        return true;
      }
      return false;
    } catch (e) {
      console.error("修改購物車失敗", e);
      return false;
    }
  };

  //從購物車移除商品
  const removeFromCart = async (commodityId) => {
    try {
      const response = await fetch("http://localhost:5000/api/removeFromCart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          commodityId,
        }),
      });
      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.commodityId !== commodityId)
        );
        alert("從購物車刪除成功");
        return true;
      }
    } catch (e) {
      console.error("從購物車刪除失敗", e);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
