import { BoxProps, useToast } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useErrorMsgStore } from "../stores/ErrorMsgStore";
import { useTxSuccessStore } from "../stores/txSuccessStore";
import { ModalError } from "./ModalError";

const ResponseHandler = () => {
  const { txSuccess, setTxSuccess } = useTxSuccessStore();
  const { errorMsg } = useErrorMsgStore();
  const toast = useToast();
  useEffect(() => {
    if (txSuccess.title !== "") {
      toast({
        title: txSuccess.title,
        description: txSuccess.description,
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });
      setTxSuccess({ title: "" });
    }
  }, [txSuccess, toast]);

  if (errorMsg === "") {
    return <></>;
  } else {
    return <ModalError />;
  }
};

export default ResponseHandler;
