import { useSession } from "next-auth/react";

import Register from "@/components/register";
import { Box, Flex } from "@chakra-ui/react";
import MemberSideBar from "@/components/memberSideBar";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <Flex justify="center" align="center" flexDirection="column">
          <Register />
        </Flex>
      </div>
    );
  }

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" p={3} borderRadius="md" bg="gray">
          <MemberSideBar />
        </Box>
        <Box p={2} pl={2}>
          <h1>歡迎, {session.user.name}</h1>
          {session.user.role === "admin" ? (
            <div>
              <h2>管理員控制台</h2>
              <p>這裡是只有管理員可以看到的內容。</p>
            </div>
          ) : (
            <div>
              <p>這裡可以瀏覽您的個人資料。</p>
            </div>
          )}
        </Box>
      </Flex>
    </div>
  );
}
