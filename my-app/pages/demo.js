import { Badge, Box, HStack, Icon, Image, Text, Stack, Flex } from "@chakra-ui/react"
import { HiStar } from "react-icons/hi"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BreadcrumbCurrentLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"

export default function Demo  () {

  const [ commodities, setCommodities ] = useState([]);
  useEffect(() => {
    const fetchCommodities = async() => {
      try{
        const response = await fetch('http://localhost:5000/api/commodities', {
          method: 'GET',
          cache: 'no-store'
        });
        const data = await response.json();
        setCommodities(data);
      }catch(e){
        console.error('獲取商品資料失敗', e);
      }
    };
    fetchCommodities();
  }, []);
  //  console.log(commodities[0]._id);

  return (
    <div>
      <BreadcrumbRoot m={3}>
        <Link href="/">首頁</Link>
        <BreadcrumbCurrentLink>商品頁面</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <Flex wrap="wrap" >
        {commodities.map((commodity) =>(
          <Link href={`/commodity/${commodity._id}`}>
            <Box  key={commodity._id} maxW="sm" borderWidth="1px" p={2} w={200}>
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
          </Link>
        ))}
      </Flex>
    </div>

  )
}

