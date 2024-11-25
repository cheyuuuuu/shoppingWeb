import { Flex } from "@chakra-ui/react";
import { RiShoppingCart2Line } from "react-icons/ri";
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";

import { MdOutlineBorderColor } from "react-icons/md";
import { AiTwotoneGift } from "react-icons/ai";

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
            <StepsItem
              index={0}
              icon={<RiShoppingCart2Line />}
              pointerEvents="none"
            />
            <StepsItem
              index={1}
              icon={<MdOutlineBorderColor />}
              pointerEvents="none"
            />
            <StepsItem
              index={2}
              icon={<AiTwotoneGift />}
              pointerEvents="none"
            />
          </StepsList>

          <StepsContent index={0}>第一步：檢視購物車</StepsContent>
          <StepsContent index={1}>
            <Flex justifyContent="center">第二步：確認訂單及填寫收件資料</Flex>
          </StepsContent>
          <StepsContent index={2}>第三步：送出</StepsContent>
          <StepsCompletedContent>
            <Flex justifyContent="right">完成訂單！</Flex>
          </StepsCompletedContent>
        </StepsRoot>
      </Flex>
    </div>
  );
}
