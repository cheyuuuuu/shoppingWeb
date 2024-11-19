import { useSession } from "next-auth/react";

import SideBar from "@/components/sideBar";
import { Box, Flex } from "@chakra-ui/react";

export default function Manner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>載入中...</div>;
  }
  if (session.user.role === "admin") {
    return (
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" p={3} borderRadius="md" bg="gray">
          <SideBar></SideBar>
        </Box>
        <Box w="90%" h="100%" p={3}>
          <h3>這是管理員區</h3>
        </Box>
      </Flex>
    );
  }
  return <div>來錯地方囉~</div>;
}
