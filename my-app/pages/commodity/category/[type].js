import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Box, HStack, Icon, Image, Text, Flex } from "@chakra-ui/react";
import { HiStar } from "react-icons/hi";
import {
  BreadcrumbCurrentLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import CommoditySideBar from "@/components/commoditySideBar";

export default function CommoditiesType() {
  const [commodities, setCommodities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    if (type) {
      const fetchProducts = async () => {
        try {
          const encodedType = encodeURIComponent(type);
          console.log("Fetching type:", encodedType);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/commodity/category/${encodedType}`, // 修改 API 路徑
            {
              method: "GET",
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setCommodities(data);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [type]);

  if (isLoading) return <p>載入中...</p>; // 修改載入檢查
  if (!commodities || commodities.length === 0)
    return (
      <div>
        <Flex p={3} minH="100vh">
          <Box
            w={{ base: "100%", lg: "10%" }}
            p={3}
            borderRight="1px"
            borderColor="gray.200"
          >
            <CommoditySideBar />
          </Box>
          <Box w={{ base: "100%", lg: "90%" }}>
            <Flex justifyContent="center" alignContent="center">
              <p>此類別沒有商品</p>
            </Flex>
          </Box>
        </Flex>
      </div>
    );

  return (
    <div>
      <Flex p={3} minH="100vh">
        <Box
          w={{ base: "100%", lg: "10%" }}
          p={3}
          borderRight="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray"
        >
          <CommoditySideBar />
        </Box>
        <Box w={{ base: "100%", lg: "90%" }}>
          <BreadcrumbRoot m={2}>
            <Link href="/" style={{ color: "white" }}>
              首頁
            </Link>
            <Link href="/commodity" style={{ color: "white" }}>
              商品頁面
            </Link>
            <BreadcrumbCurrentLink textStyle="xl" style={{ color: "white" }}>
              {type}
            </BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Flex wrap="wrap" gap={4} p={4} justifyContent="flex-start">
            {commodities.map((commodity) => (
              <Link href={`/commodity/${commodity._id}`} key={commodity._id}>
                <Box
                  maxW="sm"
                  p={2}
                  w={250}
                  m={1}
                  borderRadius="md"
                  bg={"gray"}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${commodity.image.url}`}
                    alt={commodity.name}
                    height="150px"
                    width={200}
                    mx="auto"
                    borderRadius="md"
                  />
                  <Box p="4" spaceY="5">
                    <HStack>
                      <Badge colorPalette="teal" variant="solid" p="1">
                        new
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
