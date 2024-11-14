import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Stack, Input, Button, Text, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function Upload(){
  const { data: session, status } = useSession();
  const[ commodity, setCommodity ] = useState({ name: '', description: '', price: '', number:'', image: null,})
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const handleChange =(e) => {
    const { name, value } = e.target;
    setCommodity((prevCommodity) => ({
      ...prevCommodity,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // 取得選中的檔案
    if (file) {
      setCommodity(prev => ({
        ...prev,
        image: file,  // 儲存檔案本身
      }));
    }
  };

  const onSubmit = async () => {
    
    for( let i in commodity ){
      if (commodity[i] === ""){
        alert("還有空格沒輸入！");
        return;
      }
    }
    const formData = new FormData();
    formData.append('name', commodity.name);
    formData.append('description', commodity.description);
    formData.append('price', commodity.price);
    formData.append('number', commodity.number);
    formData.append('image', commodity.image);

    

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log('商品上傳成功:', data);
      setCommodity({ name: '', description: '', price: '', number:'', image: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('商品上傳成功！ 按下確認重新整理');
      router.push('/manner/upload');
    } else {
      console.error('錯誤:', data);
      alert(data.error + '！');
    }

  };

  if (status === 'loading') {
    return <div>載入中...</div>;
  }
  if(session && session.user && session.user.role === 'admin' ){
    return(
      <div>
        <h3>這是管理員區</h3>
        <h3>新增商品</h3>
        <Box maxW="sm" mx="auto">
        <form onSubmit={handleSubmit(onSubmit)}>
         <Stack spacing={4}>
            <Input 
              
              name='name'
              placeholder='商品名稱'
              {...register("name", { required: "請輸入商品名稱" })}
              value={commodity.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              />
            {errors.name && <Text color="red.500">{errors.name.message}</Text>}
          <Input
            
            name='description'
            placeholder='商品描述'
            {...register("description", { required: "請輸入商品描述" })}
            value={commodity.description}
            onChange={handleChange}
            // isInvalid={!!errors.description}
            />
          {errors.description && <Text color="red.500">{errors.description.message}</Text>}
          <Input 
            type='number'
            name='price'
            placeholder='商品價格'
            {...register("price", { required: "請輸入商品價格" })}
            value={commodity.price}
            onChange={handleChange}
            isInvalid={!!errors.price}
            />
          {errors.price && <Text color="red.500">{errors.price.message}</Text>}
          <Input 
            type='number'
            name='number'
            placeholder='庫存數量'
            {...register("number", { required: "請輸入庫存數量" })}
            value={commodity.number}
            onChange={handleChange}
            isInvalid={!!errors.number}
           />
          {errors.number && <Text color="red.500">{errors.number.message}</Text>}
          <Input 
            type='file'
            name='image'
            accept="image/*"
            {...register("image", { required: "請選擇檔案" })}
            onChange={handleImageChange}
            isInvalid={!!errors.file}
            />
          {errors.file && <Text color="red.500">{errors.file.message}</Text>}
          <Button type='submit'>
           新增
          </Button>
          </Stack>
        </form>
        </Box>
      </div>
    )
  }
  return(
    <div>來錯地方囉~</div>
  );
}