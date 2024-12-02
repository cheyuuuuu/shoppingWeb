import { Flex, Text, Box, Image } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Flex
        direction="column"
        minH="100vh"
        justify="center" // 垂直置中
        align="center" // 水平置中
      >
        <Flex justifyContent="center">
          <Image
            src="/image/shopping-cart.png"
            w={20}
            h={20}
            className="bounceIn"
          ></Image>
        </Flex>
        <Flex justifyContent="center">
          <div className="slideUp">
            <Text textStyle="7xl">在這裡</Text>
          </div>
          <div className="slideRight">
            <Text textStyle="7xl">可以</Text>
          </div>
        </Flex>
        <Flex justifyContent="center">
          <div className="slideLeft">
            <Text textStyle="7xl">找到</Text>
          </div>
        </Flex>
        <Flex justifyContent="center" wrap="wrap">
          <Box className="slideDown">
            <Text textStyle="7xl">你喜歡的</Text>
          </Box>
          <Box className="pulse">
            <Text textStyle="7xl" color="black">
              商品
            </Text>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
}
