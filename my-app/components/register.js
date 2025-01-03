import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Stack,
  Input,
  Button,
  Text,
  Box,
  Field,
  Flex,
  defineStyle,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import SigninBtn from "@/components/SigninBtn";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    for (let i in user) {
      if (user[i] === "") {
        alert("還有空格沒輸入！");
        return;
      } else break;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("用戶創建成功:", data);
      setUser({ name: "", email: "", password: "", role: "user" });
      alert("註冊成功！按下確認跳轉至會員頁面");
      router.push("/members");
    } else {
      console.error("錯誤:", data);
      alert(data.message + "！");
    }
  };

  const floatingStyles = defineStyle({
    pos: "absolute",
    bg: "rgb(171, 170, 170)",
    borderRadius: "md",
    px: "0.5",
    top: "-3",
    insetStart: "2",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "position",
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

  return (
    <Box w={300} mx="auto" bg="gray.500" borderRadius="md" mt={5}>
      <Text fontSize="2xl" mb="4" textAlign="center" m={5}>
        會員註冊
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} spaceY={5} m={3}>
          <Field.Root isInvalid={!!errors.name}>
            <Box pos="relative" w="full">
              <Input
                className="peer"
                placeholder=""
                {...register("name", { required: "※請輸入姓名" })}
                value={user.name}
                onChange={handleChange}
                p={2}
              />
              <Field.Label css={floatingStyles}>姓名</Field.Label>
              {errors.name && (
                <Text color="red.500">{errors.name.message}</Text>
              )}
            </Box>
          </Field.Root>
          <Field.Root isInvalid={!!errors.email}>
            <Box pos="relative" w="full">
              <Input
                type="email"
                className="peer"
                placeholder=" "
                {...register("email", { required: "※請輸入電子郵件" })}
                value={user.email}
                onChange={handleChange}
                p={2}
              />
              <Field.Label css={floatingStyles}>電子郵件</Field.Label>
              {errors.email && (
                <Text color="red.500">{errors.email.message}</Text>
              )}
            </Box>
          </Field.Root>
          <Field.Root isInvalid={!!errors.password}>
            <Box pos="relative" w="full">
              <Input
                type="password"
                className="peer"
                placeholder=" "
                {...register("password", { required: "※請輸入密碼" })}
                value={user.password}
                onChange={handleChange}
                p={2}
              />
              <Field.Label css={floatingStyles}>密碼</Field.Label>
              {errors.password && (
                <Text color="red.500">{errors.password.message}</Text>
              )}
            </Box>
          </Field.Root>

          <Button type="submit" colorScheme="blue">
            註冊
          </Button>
        </Stack>
      </form>
      <Flex mt={4} justifyContent="center" mx="auto">
        <Link href="/" style={{ display: "inline-block" }}>
          <Text color="white" mt="1" textStyle="xl">
            回上一頁
          </Text>
        </Link>
        <Text color="white" mt="1" textStyle="xl" pl={3}>
          /
        </Text>
        <SigninBtn />
      </Flex>
    </Box>
  );
}
