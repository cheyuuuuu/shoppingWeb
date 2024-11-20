import {
  Badge,
  Box,
  HStack,
  Icon,
  Image,
  Text,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { HiStar } from "react-icons/hi";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BreadcrumbCurrentLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb";
import CommoditySideBar from "@/components/commoditySideBar";

export default function Commodity() {
  const [commodities, setCommodities] = useState([]);
  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/commodities", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();
        setCommodities(data);
      } catch (e) {
        console.error("獲取商品資料失敗", e);
      }
    };
    fetchCommodities();
  }, []);
  //  console.log(commodities[0]._id);

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" p={3} borderRadius="md">
          <CommoditySideBar />
        </Box>
        <Box p={2} pl={2}>
          <BreadcrumbRoot m={0} pl={2}>
            <Link href="/" style={{ color: "white" }}>
              首頁
            </Link>
            <BreadcrumbCurrentLink textStyle="xl" style={{ color: "white" }}>
              商品頁面
            </BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Flex wrap="wrap" spacing={4}>
            {commodities.map((commodity) => (
              <Link href={`/commodity/${commodity._id}`}>
                <Box
                  key={commodity._id}
                  maxW="sm"
                  p={2}
                  w={200}
                  m={1}
                  borderRadius="md"
                  bg={"gray"}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${commodity.image.url}`}
                    alt={commodity.name}
                    height="150px"
                    width={200}
                    borderRadius="md"
                  />
                  <Box p="4" spaceY="3">
                    <HStack>
                      <Badge colorPalette="teal" variant="solid" p="1">
                        新
                      </Badge>
                      <HStack gap="1" fontWeight="medium">
                        <Icon color="orange.400">
                          <HiStar />
                        </Icon>
                        <Text textStyle="2xl">{commodity.name}</Text>
                      </HStack>
                    </HStack>
                    <Text fontWeight="medium" color="fg">
                      {commodity.description}
                    </Text>
                    <HStack color="fg.muted">價格：NT${commodity.price}</HStack>
                    <HStack color="fg.muted">庫存：{commodity.number}</HStack>
                  </Box>
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}
