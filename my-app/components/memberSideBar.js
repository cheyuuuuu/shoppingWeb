import Link from "next/link";
import { Stack, Flex, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export default function MemberSideBar() {
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
          會員功能
        </Text>

        <Link href="/members/profile">會員資訊</Link>
        <Link href="/members/oldOrder">歷史訂單</Link>
        <button onClick={() => signOut()}>登出</button>
      </Flex>
    </Stack>
  );
}
