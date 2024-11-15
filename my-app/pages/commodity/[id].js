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
import { toaster } from "@/components/ui/toaster";
import {
  BreadcrumbCurrentLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CommodityDetail() {
  const [commodity, setCommodity] = useState(null);
  const [count, setCount] = useState(1);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    console.log("Session 狀態:", {
      isLoading: !session,
      user: session?.user,
      expires: session?.expires,
    });
  }, [session]);

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
    if (userEmail === undefined || userEmail === null) {
      toaster.create({
        title: "請先登入",
        type: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/addCart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          commodityId: id,
          count: count,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toaster.create({
          title: "加入購物車成功",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toaster.create({
          title: "加入購物車失敗",
          type: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("加入購物車失敗", error);
    }
  };

  if (!commodity) return <p>載入中...</p>;

  return (
    <div>
      <BreadcrumbRoot m={2}>
        <Link href="/">首頁</Link>
        <Link href="/commodity">商品頁面</Link>
        <BreadcrumbCurrentLink textStyle="xl">
          {commodity.name}
        </BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <Flex wrap="wrap" spaceX="0" p={3} direction="row">
        <Box w="20%" p={3} borderRight="1px" borderColor="gray.200">
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
        <Box
          key={commodity._id}
          maxW="sm"
          borderWidth="1px"
          p={2}
          w={200}
          m={1}
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
                <Text textStyle="lg">{commodity.name}</Text>
              </HStack>
            </HStack>
            <Text fontWeight="medium" color="fg">
              {commodity.description}
            </Text>
            <HStack color="fg.muted">價格：NTD{commodity.price}</HStack>
            <HStack color="fg.muted">庫存：{commodity.number}</HStack>
          </Box>
        </Box>
        <Box p={2} spaceX={2}>
          <Text pl={2}>數量：</Text>
          <Input
            type="number"
            value={count}
            onChange={(e) => handleChangeCount(e.target.value)}
            min={1}
            max={commodity.number}
            w={10}
          />
          <Button
            onClick={handleAddToCart}
            disabled={!userEmail || count < 1 || count > commodity.number}
            p={2}
          >
            加入購物車
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
