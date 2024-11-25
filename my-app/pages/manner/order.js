import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { For, Stack, Table, Flex, Box, Text, Grid } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import SideBar from "@/components/sideBar";

export default function Edit() {
  const [orders, setOrders] = useState([]);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/manner/orders",
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const data = await response.json();
        setOrders(data);
      } catch (e) {
        console.error("獲取訂單資料失敗", e);
      }
    };
    fetchOrder();
  }, []);

  const handleCheckBoxChange = (id) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isSelected: !prev[id].isSelected, //切換選取狀態
      },
    }));
  };

  //   const handleUpdate = async () => {
  //     const selectedUpdates = Object.keys(updates)
  //       .filter((id) => updates[id].isSelected)
  //       .reduce((acc, id) => {
  //         acc[id] = { price: updates[id].price, number: updates[id].number };
  //         return acc;
  //       }, {});

  //     if (Object.keys(selectedUpdates).length === 0) {
  //       alert("請先勾選需要修改的商品");
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         "http://localhost:5000/api/manner/order/check",
  //         {
  //           method: "PATCH",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ updates: selectedUpdates }),
  //         }
  //       );
  //       const result = await response.json();
  //       if (response.ok) {
  //         console.log("更新成功", result);
  //         alert("修改成功！");
  //       } else {
  //         console.error("更新失敗", result.message);
  //       }
  //     } catch (e) {
  //       console.error("更新商品資料失敗", e);
  //     }
  //   };

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" p={3} borderRadius="md" bg="gray">
          <SideBar></SideBar>
        </Box>
        <Box w="90%" h="100%" p={3} overflowY="auto">
          <Stack gap="10" m={5}>
            <For each={["outline"]}>
              {(variant) => (
                <Table.Root
                  key={variant}
                  size="sm"
                  variant={variant}
                  showColumnBorder
                  stickyHeader
                  maxH="calc(100vh - 100px)" // 設置最大高度
                  overflowY="auto" // 添加垂直滾動
                  borderRadius="md"
                  shadow="5px 5px 5px gray, -5px 5px 5px gray"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader p={3} textAlign="center" width="3%">
                        勾選
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        訂單編號
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        收件人
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="10%">
                        收件地址
                      </Table.ColumnHeader>

                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        收件人電話
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="20%">
                        購買商品
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        總金額
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        付款方式
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {orders.map((item, index) => (
                      <Table.Row key={item._id}>
                        <Table.Cell textAlign="center">
                          <Flex
                            align="center"
                            justify="center"
                            w="100%"
                            h="100%"
                            mt={2}
                            mb={2}
                          >
                            <Checkbox
                              variant="subtle"
                              colorPalette="gray"
                              type="checkbox"
                              size="md"
                              // checked={orders[item._id].isSelected || false}
                              // onCheckedChange={() =>
                              //   handleCheckBoxChange(orders._id)
                              // }
                            ></Checkbox>
                          </Flex>
                        </Table.Cell>

                        <Table.Cell textAlign="left" pl={3}>
                          {index + 1}. {item._id}
                        </Table.Cell>

                        <Table.Cell textAlign="center">{item.name}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.address}
                        </Table.Cell>
                        <Table.Cell textAlign="center">{item.tel}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Grid
                            templateColumns="repeat(auto-fit, minmax(200px, 1fr))" // 自動分配列寬
                            gap={1}
                            justifyContent="left"
                            alignItems="center"
                            w="100%"
                          >
                            {item.commodities.map((i, index) => (
                              <Flex
                                key={index}
                                direction="row"
                                align="center"
                                justify="left"
                                gap={4}
                                pl={1}
                              >
                                <Text whiteSpace="nowrap" color="red.600">
                                  {index + 1}.
                                </Text>
                                <Text whiteSpace="nowrap">
                                  商品：{i.commodityName}
                                </Text>
                                <Text whiteSpace="nowrap">數量：{i.count}</Text>
                              </Flex>
                            ))}
                          </Grid>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.totalPrice}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.payment}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </For>
          </Stack>
          {/* <Button
            onClick={handleUpdate}
            size="sm"
            m={5}
            p={2}
            variant="surface"
          >
            <FaEdit />
            修改
          </Button> */}
        </Box>
      </Flex>
    </div>
  );
}