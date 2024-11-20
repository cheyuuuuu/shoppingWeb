import Link from "next/link";
import { Stack, Flex, Text } from "@chakra-ui/react";
import { types } from "@/data/commodityTypes";

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
        {types.map((type) => (
          <Link
            key={type}
            href={`/commodity/category/${encodeURIComponent(type)}`}
          >
            {type}
          </Link>
        ))}
      </Flex>
    </Stack>
  );
}
