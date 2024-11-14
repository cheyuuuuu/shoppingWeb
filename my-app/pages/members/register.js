import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { Stack, Input, Button, Text, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState({ name: '', email: '', password: '', role: 'user' });
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

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('用戶創建成功:', data);
      setUser({ name: '', email: '', password: '', role: 'user' });
      alert("註冊成功！按下確認跳轉至首頁");
      router.push('/');
    } else {
      console.error('錯誤:', data);
      alert(data.message + "！");
    }
  };

  return (
    <Box maxW="sm" mx="auto">
      <Text fontSize="2xl" mb="4" textAlign='center' m={5}>會員註冊</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Input
            placeholder=" 姓名"
            {...register("name", { required: "請輸入姓名" })}
            value={user.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            p={2}
          />
          {errors.name && <Text color="red.500">{errors.name.message}</Text>}

          <Input
            type="email"
            placeholder=" 電子郵件"
            {...register("email", { required: "請輸入電子郵件" })}
            value={user.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            p={2}
          />
          {errors.email && <Text color="red.500">{errors.email.message}</Text>}

          <Input
            type="password"
            placeholder=" 密碼"
            {...register("password", { required: "請輸入密碼" })}
            value={user.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            p={2}
          />
          {errors.password && <Text color="red.500">{errors.password.message}</Text>}

          <Button type="submit" colorScheme="blue">註冊</Button>
        </Stack>
      </form>
      <Link href="/members">
        <Text color="blue.500" mt="4" textAlign="center">回上一頁</Text>
      </Link>
    </Box>
  );
}
