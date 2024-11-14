import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SideBar from '@/components/sideBar';
import { Box } from "@chakra-ui/react"

export default function Manner(){
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>載入中...</div>;
  }
  if(session.user.role === 'admin' ){
    return(
      <Box >
        
        <SideBar></SideBar>
        <h3>這是管理員區</h3>
      </Box>
    )
  }
  return(
    <div>來錯地方囉~</div>
  );
}