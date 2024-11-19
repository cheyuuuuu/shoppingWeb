import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  HStack,
  Icon,
  Image,
  Text,
  Stack,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import { HiStar } from "react-icons/hi";
import {
  BreadcrumbCurrentLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { StepperInput } from "@/components/ui/stepper-input";

export default function CommodityDetail() {
  const [commodity, setCommodity] = useState(null);
  const [count, setCount] = useState(1);
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const response = await fetch(
          `http://localhost:5000/api/commodity/${id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const CommodityData = await response.json();

        setCommodity(CommodityData);
      };
      fetchProduct();
    }
  }, [id]);

  const handleChangeCount = (value) => {
    const newCount = Math.max(
      1,
      Math.min(Number(value), commodity?.number || 1)
    );
    setCount(newCount);
  };

  const handleAddToCart = async () => {
    const success = await addToCart(id, count);
    if (success) {
      alert("加入購物車成功");
    }
  };

  if (!commodity) return <p>載入中...</p>;

  return (
    <div>
      <Flex wrap="wrap" p={3} minH="100vh">
        <Box
          w={{ base: "100%", lg: "10%" }}
          p={3}
          borderRight="1px"
          borderColor="gray.200"
        >
          <Text fontSize="lg" fontWeight="bold">
            商品分類
          </Text>
          <Stack spacing={4}>
            <Link href="/category/1">
              <Text>分類 1</Text>
            </Link>
            <Link href="/category/2">
              <Text>分類 2</Text>
            </Link>
            <Link href="/category/3">
              <Text>分類 3</Text>
            </Link>
          </Stack>
        </Box>
        <Box w={{ base: "100%", lg: "20%" }}>
          <BreadcrumbRoot m={2}>
            <Link href="/" style={{ color: "white" }}>
              首頁
            </Link>
            <Link href="/commodity" style={{ color: "white" }}>
              商品頁面
            </Link>
            <BreadcrumbCurrentLink textStyle="xl" style={{ color: "white" }}>
              {commodity.name}
            </BreadcrumbCurrentLink>
          </BreadcrumbRoot>
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
              <HStack color="fg.muted">價格：NTD{commodity.price}</HStack>
              <HStack color="fg.muted">庫存：{commodity.number}</HStack>
            </Box>
          </Box>
        </Box>
        <Box
          w={{ base: "100%", md: "15%" }} // 響應式寬度
          p={4}
        >
          <Stack spacing={4} w="full">
            <Text pl={2}>數量：</Text>
            <StepperInput
              type="number"
              value={count}
              onValueChange={(e) => handleChangeCount(e.value)}
              min={1}
              max={commodity.number}
              w="100px"
              mb={2}
            />
            <Button
              onClick={handleAddToCart}
              disabled={!userEmail || count < 1 || count > commodity.number}
              p={2}
              w="200px"
            >
              加入購物車
            </Button>
          </Stack>
        </Box>
      </Flex>
    </div>
  );
}
