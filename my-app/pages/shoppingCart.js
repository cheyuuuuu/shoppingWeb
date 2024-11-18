import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { For, Stack, Table, Flex, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function ShoppingCart() {
  const { cartItems, removeFromCart } = useCart();
  const [commodities, setCommodities] = useState({});
  const { data: session } = useSession();
  let totalPrice = 0;
  // 獲取商品詳細資訊
  useEffect(() => {
    const fetchCommodities = async () => {
      const commodityDetails = {};
      for (const item of cartItems) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/commodity/${item.commodityId}`
          );
          const data = await response.json();
          commodityDetails[item.commodityId] = data;
        } catch (error) {
          console.error("獲取商品資訊失敗:", error);
        }
      }
      setCommodities(commodityDetails);
    };

    fetchCommodities();
  }, [cartItems]);

  cartItems.forEach((item) => {
    totalPrice += commodities[item.commodityId]?.price * item.count;
  });

  if (!session) {
    return <div>請先登入</div>;
  }

  if (cartItems.length === 0) {
    return <div>購物車是空的喔~</div>;
  }

  return (
    <div>
      <h1>購物車</h1>
      <Stack gap="10">
        <For each={["outline"]}>
          {(variant) => (
            <Table.Root
              key={variant}
              size="sm"
              variant={variant}
              showColumnBorder
              stickyHeader
            >
              <Table.Header bg={"gray.300"}>
                <Table.Row>
                  <Table.ColumnHeader p={3} textAlign="center" width="20%">
                    商品名稱
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={3} textAlign="center" width="10%">
                    價格
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={3} textAlign="center" width="10%">
                    數量
                  </Table.ColumnHeader>
                  <Table.ColumnHeader p={3} textAlign="center" width="5%">
                    操作
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cartItems.map((item) => (
                  <Table.Row key={item.commodityId}>
                    <Table.Cell textAlign="center">
                      {commodities[item.commodityId]?.name}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {commodities[item.commodityId]?.price}
                    </Table.Cell>

                    <Table.Cell textAlign="center">{item.count}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Flex
                        justify="center" // 水平置中
                        align="center" // 垂直置中
                        w="full"
                        m={1}
                      >
                        <Button
                          onClick={() => removeFromCart(item.commodityId)}
                        >
                          移除
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </For>
      </Stack>
      <label>總金額{totalPrice}元</label>
    </div>
  );
}
