import { For, Stack, Table, Flex, Button, Text } from "@chakra-ui/react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Step from "@/components/step";
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";

export default function Order() {
  const { cartItems } = useCart();
  const [commodities, setCommodities] = useState({});
  let totalPrice = 0;

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
      <Flex
        mx="auto"
        justifyContent="center"
        alignItems="center"
        gap={4}
        mt={5}
      >
        <Text fontSize="2xl">總金額{totalPrice}元</Text>
        <Button onClick={() => ({})}>送出</Button>
      </Flex>
    </div>
  );
}
