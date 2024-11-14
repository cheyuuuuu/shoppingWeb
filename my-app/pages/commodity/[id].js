import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Box, HStack, Icon, Image, Text, Stack, Flex } from "@chakra-ui/react"
import { HiStar } from "react-icons/hi"
import {
  BreadcrumbCurrentLink,
  
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';

export default function CommodityDetail(){
  const [ commodity, setCommodity ] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {  
        const response = await fetch(`http://localhost:5000/api/commodity/${id}` ,{
          method: 'GET',
          cache: 'no-store'
        });
        const data = await response.json();
        
        setCommodity(data);
      };
      fetchProduct();
    }

  }, [id]);

  if (!commodity) return <p>載入中...</p>;


  return(
    <div>
      <BreadcrumbRoot m={2}>
        <Link href="/">首頁</Link>
        <Link href="/commodity">商品頁面</Link>
        <BreadcrumbCurrentLink textStyle= "xl">{commodity.name}</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <Flex  wrap="wrap" spaceX="0" p={3} direction="row">
        <Box w="20%" p={3} borderRight="1px" borderColor="gray.200">
            <Text fontSize="lg" fontWeight="bold">商品分類</Text>
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
        <Box  key={commodity._id} maxW="sm" borderWidth="1px" p={2} w={200}  m={1}>
          <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}${commodity.image.url}`} 
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
                <Text textStyle="lg">
                  {commodity.name}
                </Text>
              </HStack>
            </HStack>
                <Text fontWeight="medium" color="fg">
                {commodity.description}
                </Text>
                <HStack color="fg.muted">
                價格：NTD{commodity.price} 
                </HStack>
                <HStack color="fg.muted">
                庫存：{commodity.number}
                </HStack>
              </Box>
          </Box>
      </Flex>
    </div>
  );
}