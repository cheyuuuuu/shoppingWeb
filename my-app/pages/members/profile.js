import { useEffect, useState } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MemberSideBar from "@/components/memberSideBar";
import { CgProfile } from "react-icons/cg";

export default function OldOrder() {
  const [profile, setProfile] = useState([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/members/profile/${userEmail}`
          );
          const data = await response.json();
          setProfile(data);
        } catch (e) {
          console.error("獲取個人資料失敗", e);
        }
      };
      fetchUser();
    }
  }, [userEmail]);

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" bg="gray" borderRadius="md" pt={3}>
          <MemberSideBar />
        </Box>
        <Box w="90%" h="100%" p={3} overflowY="auto">
          <Flex flexDirection="column" justify="center" align="center">
            <Box>
              <CgProfile />
            </Box>
            <Box spaceY={2} mt={3}>
              <Text>會員ID：{profile._id}</Text>
              <Text>姓名：{profile.name}</Text>
              <Text>電子信箱：{profile.email}</Text>
              <Text>
                權限：{profile.role === "admin" ? "管理員" : "一般會員"}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}
