import { useEffect, useState } from "react";

import { For, Stack, Table, Flex, Box, Text, Grid } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import SideBar from "@/components/sideBar";

export default function OldOrder() {
  const [orders, setOrders] = useState([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/members/oldOrders/${userEmail}`
          );
          const data = await response.json();
          setOrders(data);
        } catch (e) {
          console.error("獲取訂單資料失敗", e);
        }
      };
      fetchOrder();
    }
  }, [userEmail]);

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
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
                  bg="gray"
                >
                  <Table.Header>
                    <Table.Row>
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
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        狀態
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {orders.map((item, index) => (
                      <Table.Row key={item._id}>
                        <Table.Cell textAlign="left" pl={3} h={10}>
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
                        <Table.Cell textAlign="center">
                          <Text
                            color={
                              item.status === "未處理"
                                ? "#8B0000"
                                : item.status === "已處理"
                                ? "#556B2F"
                                : "gray.500" // 已取消的狀態
                            }
                          >
                            {item.status}
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </For>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
