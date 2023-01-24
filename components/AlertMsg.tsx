import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Collapse,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  alertMsg: string;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  type: "success" | "warning" | "error" | "info";
  time?: number;
  isClosable?: boolean;
};

export const AlertMsg = ({
  alertMsg,
  setAlertMsg,
  type,
  time = 3000,
  isClosable = false,
}: Props) => {
  const [description, setDescription] = useState("");
  const handleClose = () => {
    setAlertMsg("");
  };

  useEffect(() => {
    if (alertMsg !== "") {
      setDescription(alertMsg);
    }
  }, [alertMsg]);

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout;
    if (alertMsg !== "" && time !== Infinity) {
      const extraTimeForLongMsg =
        time === 3000 && alertMsg.length > 30 ? alertMsg.length * 50 : 0;
      timeoutRef = setTimeout(() => {
        if (alertMsg !== "") {
          setAlertMsg("");
        }
      }, time + extraTimeForLongMsg);
    }
    return () => {
      if (time !== Infinity) {
        clearTimeout(timeoutRef);
      }
    };
  }, [alertMsg, time]);

  return (
    <Collapse in={alertMsg !== ""} animateOpacity>
      {type === "error" || type === "success" ? (
        <Alert
          status={type}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          mt="10px"
          overflowX="scroll"
        >
          {isClosable && (
            <CloseButton
              alignSelf="flex-end"
              position="relative"
              right={-1}
              top={-1}
              onClick={handleClose}
            />
          )}
          <AlertIcon boxSize="40px" mr={0} />
          <Box>
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {type.toUpperCase()}
            </AlertTitle>
            <AlertDescription fontSize="12px">{description}</AlertDescription>
          </Box>
        </Alert>
      ) : (
        <Alert status={type} justifyContent="center" mt="10px">
          <AlertIcon />
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      )}
    </Collapse>
  );
};
