import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { For, Stack, Table, Flex, Button, Box, Text } from "@chakra-ui/react";
import { StepsRoot } from "@/components/ui/steps";
import Step from "@/components/step";
import { StepperInput } from "@/components/ui/stepper-input";
import { useSession } from "next-auth/react";

export default function ShoppingCart() {
  const { cartItems, removeFromCart, updateCartItemCount, updateCart } =
    useCart();
  const [commodities, setCommodities] = useState({});
  const { data: session } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email;
  let totalPrice = 0;

  // 獲取商品詳細資訊
  useEffect(() => {
    const fetchCommodities = async () => {
      const commodityDetails = {};
      const validCartItems = [...cartItems];
      let hasInvalidItems = false;
      for (let i = 0; i < validCartItems.length; i++) {
        const item = validCartItems[i];
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/commodity/${item.commodityId}`
          );
          const data = await response.json();
          //避免發生已放入的商品被刪除仍存在購物車中
          if (data.message === "商品未找到") {
            const commodityId = validCartItems[i].commodityId;
            const checkResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/userCart/delete`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userEmail,
                  commodityId,
                }),
              }
            );
            const checkData = await checkResponse.json();
            validCartItems.splice(i, 1);
            hasInvalidItems = true;
            0;
            i--;
          } else {
            commodityDetails[item.commodityId] = data;
          }
        } catch (error) {
          console.error("獲取商品資訊失敗:", error);
        }
      }
      if (hasInvalidItems) {
        updateCart(validCartItems);
      }
      setCommodities(commodityDetails);
    };

    if (cartItems.length > 0) {
      fetchCommodities();
    }
  }, [cartItems]);

  const handleCountChange = async (commodityId, value) => {
    const numberValue = Number(value);

    const success = await updateCartItemCount(commodityId, numberValue);
    if (success) {
      console.log("數量已更新");
    } else {
      console.log("數量更新失敗");
    }
  };

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
      <Step currentStep={0}></Step>

      <Stack gap="10">
        <For each={["outline"]}>
          {(variant) => (
            <Table.Root
              key={variant}
              size="sm"
              variant={variant}
              showColumnBorder
              stickyHeader
              borderRadius="md"
              shadow="5px 5px 5px black"
              w={{ base: "100%", md: "80%", xl: "70%" }}
              justifyContent="center"
              mx="auto"
              mt={5}
              bg="gray"
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
                    <Table.Cell textAlign="center" justifyItems="center">
                      <StepperInput
                        defaultValue={item.count}
                        p={2}
                        min={1}
                        max={commodities[item.commodityId]?.number}
                        onValueChange={({ value }) =>
                          handleCountChange(item.commodityId, value)
                        }
                      />
                    </Table.Cell>

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
      <Flex mx="auto" justifyContent="center" alignItems="center" gap={4}>
        <Text fontSize="2xl">總金額{totalPrice}元</Text>
        <Button onClick={() => router.push("/order")} m={4}>
          結帳
        </Button>
      </Flex>
    </div>
  );
}
