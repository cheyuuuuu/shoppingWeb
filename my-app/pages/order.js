import {
  For,
  Stack,
  Table,
  Box,
  Input,
  Flex,
  Button,
  Text,
  Field,
  defineStyle,
} from "@chakra-ui/react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Step from "@/components/step";

export default function Order() {
  const { data: session } = useSession();
  const { cartItems, clearCart } = useCart();
  const [commodities, setCommodities] = useState({});
  const [order, setOrder] = useState({
    name: "",
    address: "",
    tel: "",
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const userEmail = session?.user?.email;
  let totalPrice = 0;

  //獲取商品資料
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

  //計算總金額
  cartItems.forEach((item) => {
    totalPrice += commodities[item.commodityId]?.price * item.count;
  });

  //處理訂單表單
  const onSubmit = async () => {
    if (!order.name || !order.address || !order.tel) {
      alert("請填寫所有必填欄位！");
      return;
    }
    try {
      const orderData = {
        userEmail,
        name: order.name,
        address: order.address,
        tel: order.tel,
        commodities: cartItems,
        totalPrice,
      };

      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("訂單建立成功:", data);
        setOrder({
          name: "",
          address: "",
          tel: "",
        });
        //清空前端購物車
        clearCart();
        alert("訂單建立成功！");
        router.push("/orderComplete");
      } else {
        console.error("錯誤:", data.error);
        alert(data.error + "！");
      }
    } catch (error) {
      console.error("訂單提交錯誤:", error);
      alert("訂單提交發生錯誤，請稍後再試！");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const floatingStyles = defineStyle({
    pos: "absolute",
    bg: "gray",
    px: "0.5",
    top: "-2",
    margin: "2",
    insetStart: "2",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "position",
    zIndex: 2,
    _peerPlaceholderShown: {
      color: "fg.muted",
      top: "2.5",

      insetStart: "3",
    },
    _peerFocusVisible: {
      color: "fg",
      top: "-3",
      insetStart: "2",
    },
  });
  if (cartItems.length === 0) {
    router.push("/commodity");
    return <div>購物車是空的</div>;
  }

  return (
    <div>
      <Step currentStep={1}></Step>
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
              shadow="5px 5px 5px gray"
              w={{ base: "100%", md: "80%", xl: "70%" }}
              justifyContent="center"
              mx="auto"
              mt={5}
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
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cartItems.map((item) => (
                  <Table.Row key={item.commodityId} h={10}>
                    <Table.Cell textAlign="center">
                      {commodities[item.commodityId]?.name}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {commodities[item.commodityId]?.price}
                    </Table.Cell>
                    <Table.Cell textAlign="center" justifyItems="center">
                      {item.count}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </For>
      </Stack>
      <Flex justifyContent="center" mt={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4} width="300px">
            <Flex justifyContent="center">
              <Text fontSize="2xl">總金額{totalPrice}元</Text>
            </Flex>
            <Field.Root>
              <Box pos="relative" w="full">
                <Input
                  className="peer"
                  name="name"
                  placeholder=""
                  {...register("name", { required: "請輸入收件人姓名" })}
                  value={order.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  m={3}
                />
                {errors.name && (
                  <Text color="red.500">{errors.name.message}</Text>
                )}
                <Field.Label css={floatingStyles}>收件人</Field.Label>
              </Box>
            </Field.Root>
            <Field.Root>
              <Box pos="relative" w="full">
                <Input
                  className="peer"
                  name="address"
                  placeholder=""
                  {...register("address", {
                    required: "請輸入收件地址",
                  })}
                  value={order.address}
                  onChange={handleChange}
                  m={3}
                  width="full"
                  isInvalid={!!errors.address}
                />
                {errors.address && (
                  <Text color="red.500">{errors.address.message}</Text>
                )}
                <Field.Label css={floatingStyles}>收件人地址</Field.Label>
              </Box>
            </Field.Root>

            <Field.Root>
              <Box pos="relative" w="full">
                <Input
                  className="peer"
                  name="tel"
                  placeholder=""
                  {...register("tel", { required: "請輸入收件人電話" })}
                  value={order.tel}
                  onChange={handleChange}
                  isInvalid={!!errors.tel}
                  m={3}
                  min={0}
                />
                {errors.tel && (
                  <Text color="red.500">{errors.tel.message}</Text>
                )}
                <Field.Label css={floatingStyles}>收件人電話</Field.Label>
              </Box>
            </Field.Root>
            <Button type="submit" width="full">
              送出
            </Button>
          </Stack>
        </form>
      </Flex>
      <Flex
        mx="auto"
        justifyContent="center"
        alignItems="center"
        gap={4}
        mt={5}
      >
        <Button onClick={() => router.push("/shoppingCart")} m={4}>
          回上一頁
        </Button>
      </Flex>
    </div>
  );
}
