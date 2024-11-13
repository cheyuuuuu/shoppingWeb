import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';

import { Button } from "@/components/ui/button"
import { Button, Input, Stack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"

export default function Register() {
  const [user, setUser] = useState({ name: '', email: '', password: '', role:'user' });
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for( let i in user ){
        if (user[i] === ""){
          alert("還有空格沒輸入！");
          return;
        }else break;
      }
    

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('用戶創建成功:', data);
      setUser({ name: '', email: '', password: '',role:'user' });
      alert("註冊成功！ 按下確認跳轉至登入")
      router.push('/members/login');
    } else {
      console.error('錯誤:', data);
      alert(data.message + "！");
    }
  };

  return 
    (
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field
            label="First name"
            invalid={!!errors.firstName}
            errorText={errors.firstName?.message}
          >
            <Input
              {...register("firstName", { required: "First name is required" })}
            />
          </Field>
          <Field
            label="Last name"
            invalid={!!errors.lastName}
            errorText={errors.lastName?.message}
          >
            <Input
              {...register("lastName", { required: "Last name is required" })}
            />
          </Field>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    )
}

