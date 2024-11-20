import { Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import { LuCalendar, LuUser, LuWallet } from "react-icons/lu";

export default function Step({ currentStep = 0 }) {
  return (
    <div>
      <Flex
        w={{ base: "100%", md: "80%", xl: "50%" }}
        justifyContent="center"
        mx="auto"
        mt={5}
      >
        <StepsRoot defaultStep={currentStep} count={3}>
          <StepsList>
            <StepsItem index={0} icon={<LuUser />} pointerEvents="none" />
            <StepsItem index={1} icon={<LuWallet />} pointerEvents="none" />
            <StepsItem index={2} icon={<LuCalendar />} pointerEvents="none" />
          </StepsList>

          <StepsContent index={0}>第一步：檢視購物車</StepsContent>
          <StepsContent index={1}>第二步：確認訂單及填寫收件資料</StepsContent>
          <StepsContent index={2}>第三步：完成</StepsContent>
        </StepsRoot>
      </Flex>
    </div>
  );
}
