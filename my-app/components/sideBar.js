import Link from "next/link";
import { Stack, Flex } from "@chakra-ui/react";

export default function SideBar() {
  return (
    <Stack>
      <Flex
        direction="column"
        h="100%"
        alignItems="center" // 水平置中
        justifyContent="center" // 垂直置中
        spaceY={3}
      >
        <Link href="/manner">管理員區</Link>
        <Link href="/manner/upload">新增商品</Link>
        <Link href="/manner/edit">編輯商品</Link>
      </Flex>
    </Stack>
  );
}
