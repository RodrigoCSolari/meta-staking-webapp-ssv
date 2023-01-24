import { BoxProps, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorHashHandler } from "../utils/errorHandlers";

const ErrorHandlerHash = (props: BoxProps) => {
  const router = useRouter();
  const toast = useToast();
  const id = router.query && router.query.id ? router.query.id : "";
  const transactionHashes = router.query.transactionHashes;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      ErrorHashHandler(router, toast);
      setIsLoaded(true);
    })();
  }, [transactionHashes, toast]);

  return <></>;
};

export default ErrorHandlerHash;
