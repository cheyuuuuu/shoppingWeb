import Link from "next/link";
import { Stack, Flex, Text } from "@chakra-ui/react";

export default function CommoditySideBar() {
  return (
    <Stack>
      <Flex
        direction="column"
        h="100%"
        alignItems="center" // 水平置中
        justifyContent="center" // 垂直置中
        spaceY={3}
      >
        <Text fontSize="lg" fontWeight="bold">
          商品分類
        </Text>
        <Link href="/">分類1</Link>
        <Link href="/">分類2</Link>
        <Link href="/">分類3</Link>
      </Flex>
    </Stack>
  );
}
