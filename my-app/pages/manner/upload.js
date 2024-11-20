import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Stack,
  Input,
  Button,
  Text,
  Box,
  Flex,
  Field,
  defineStyle,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import SideBar from "@/components/sideBar";
import { types } from "@/data/commodityTypes";

export default function Upload() {
  const { data: session, status } = useSession();
  const [commodity, setCommodity] = useState({
    name: "",
    description: "",
    price: "",
    number: "",
    type: "",
    image: null,
  });
  const fileInputRef = useRef(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommodity((prevCommodity) => ({
      ...prevCommodity,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 取得選中的檔案
    if (file) {
      setCommodity((prev) => ({
        ...prev,
        image: file, // 儲存檔案本身
      }));
    }
  };

  const onSubmit = async () => {
    for (let i in commodity) {
      if (commodity[i] === "") {
        alert("還有空格沒輸入！");
        return;
      }
    }
    const formData = new FormData();
    formData.append("name", commodity.name);
    formData.append("description", commodity.description);
    formData.append("type", commodity.type);
    formData.append("price", commodity.price);
    formData.append("number", commodity.number);
    formData.append("image", commodity.image);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log("商品上傳成功:", data);
      setCommodity({
        name: "",
        description: "",
        type: "",
        price: "",
        number: "",
        image: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("商品上傳成功！ 按下確認重新整理");
      router.push("/manner/upload");
    } else {
      console.error("錯誤:", data);
      alert(data.error + "！");
    }
  };

  const floatingStyles = defineStyle({
    pos: "absolute",
    bg: "gray",
    px: "0.5",
    top: "-2",
    margin: "2",
    insetStart: "2",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "position",
    zIndex: 2,
    _peerPlaceholderShown: {
      color: "fg.muted",
      top: "2.5",

      insetStart: "3",
    },
    _peerFocusVisible: {
      color: "fg",
      top: "-3",
      insetStart: "2",
    },
  });

  if (status === "loading") {
    return <div>載入中...</div>;
  }
  if (session && session.user && session.user.role === "admin") {
    return (
      <div>
        <Flex p={3} direction="row" h="100vh" w="100%">
          <Box w="10%" h="100%" p={3} borderRadius="md" bg="gray">
            <SideBar></SideBar>
          </Box>
          <Box w="90%" h="100%" p={3}>
            <Box
              maxW="sm"
              mx="auto"
              spaceY={5}
              justifyItems="center"
              borderRadius="md"
              bg="gray"
            >
              <Flex pt={5}>
                <Text fontSize="xl" fontWeight="bold">
                  新增商品
                </Text>
              </Flex>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                  <Field.Root>
                    <Box pos="relative" w="full">
                      <Input
                        className="peer"
                        name="name"
                        placeholder=""
                        {...register("name", { required: "請輸入商品名稱" })}
                        value={commodity.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        m={3}
                        pl={2}
                      />
                      {errors.name && (
                        <Text color="red.500">{errors.name.message}</Text>
                      )}
                      <Field.Label css={floatingStyles}>商品名稱</Field.Label>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Box pos="relative" w="full">
                      <Input
                        className="peer"
                        name="description"
                        placeholder=""
                        {...register("description", {
                          required: "請輸入商品描述",
                        })}
                        value={commodity.description}
                        onChange={handleChange}
                        m={3}
                        pl={2}
                        isInvalid={!!errors.description}
                      />
                      {errors.description && (
                        <Text color="red.500">
                          {errors.description.message}
                        </Text>
                      )}
                      <Field.Label css={floatingStyles}>商品描述</Field.Label>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Box pos="relative" w="full" pl={3}>
                      <select
                        name="type"
                        style={{
                          backgroundColor: "gray",
                          border: "1px solid white",
                          borderRadius: "3px",
                        }}
                        {...register("type", { required: "請選擇商品類型" })}
                        value={commodity.type}
                        defaultValue=""
                        onChange={handleChange}
                        isInvalid={!!errors.type}
                      >
                        <option value="" disabled>
                          請選擇一個類型
                        </option>
                        {types.map((type) => (
                          <option value={type}>{type}</option>
                        ))}
                      </select>
                    </Box>
                  </Field.Root>

                  <Field.Root>
                    <Box pos="relative" w="full">
                      <Input
                        className="peer"
                        type="number"
                        name="price"
                        placeholder=""
                        {...register("price", { required: "請輸入商品價格" })}
                        value={commodity.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                        m={3}
                        pl={2}
                        min={0}
                      />
                      {errors.price && (
                        <Text color="red.500">{errors.price.message}</Text>
                      )}
                      <Field.Label css={floatingStyles}>商品價格</Field.Label>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Box pos="relative" w="full">
                      <Input
                        className="peer"
                        type="number"
                        name="number"
                        placeholder=""
                        {...register("number", { required: "請輸入庫存數量" })}
                        value={commodity.number}
                        onChange={handleChange}
                        isInvalid={!!errors.number}
                        m={3}
                        pl={2}
                        min={0}
                      />
                      {errors.number && (
                        <Text color="red.500">{errors.number.message}</Text>
                      )}
                      <Field.Label css={floatingStyles}>庫存數量</Field.Label>
                    </Box>
                  </Field.Root>
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    {...register("image", { required: "請選擇檔案" })}
                    onChange={handleImageChange}
                    isInvalid={!!errors.file}
                    m={3}
                  />
                  {errors.file && (
                    <Text color="red.500">{errors.file.message}</Text>
                  )}

                  <Button type="submit" m={3}>
                    新增
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        </Flex>
      </div>
    );
  }
  return <div>來錯地方囉~</div>;
}
