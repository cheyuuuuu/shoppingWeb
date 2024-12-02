import { Flex, Box, List, Text } from "@chakra-ui/react";

export default function About() {
  return (
    <div>
      <List.Root variant="marker" gap={30} ml={10}>
        <Text textStyle="3xl" mt={5}>
          本網站技術重點
        </Text>
        <List.Item _marker={{ color: "black" }} textStyle="xl">
          前端 Frontend
          <List.Root ps="5" gap={2}>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideUp"
            >
              React, Next.js
            </List.Item>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideDown"
            >
              Chakra UI, Wicked CSS
            </List.Item>
          </List.Root>
        </List.Item>

        <List.Item _marker={{ color: "black" }} textStyle="xl">
          後端 Backend
          <List.Root ps="5" gap={2}>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideUp"
            >
              Node.js Express
            </List.Item>

            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideDown"
            >
              MongoDB CRUD
            </List.Item>
          </List.Root>
        </List.Item>
        <List.Item _marker={{ color: "black" }} textStyle="xl">
          部署上線
          <List.Root ps="5" gap={2}>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="fadeIn"
            >
              AWS EC2
            </List.Item>
          </List.Root>
        </List.Item>
        <List.Item _marker={{ color: "black" }} textStyle="xl">
          網站功能
          <List.Root ps="5" gap={2}>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideDown"
            >
              會員註冊、登入、登出、第三方驗證、Bcrypt加密
            </List.Item>

            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideUp"
            >
              管理員區：商品上架、下架、修改庫存及價格、訂單管理狀態變更
            </List.Item>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideDown"
            >
              商品陳列：商品分類、個別商品動態路由
            </List.Item>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideUp"
            >
              一般會員：購物車、結帳、訂單建立、歷史訂單查詢、查看會員資料
            </List.Item>
            <List.Item
              _marker={{ color: "black" }}
              textStyle="xl"
              className="slideDown"
            >
              管理員帳號：admin@admin.com 密碼：admin
            </List.Item>
          </List.Root>
        </List.Item>
      </List.Root>
    </div>
  );
}
