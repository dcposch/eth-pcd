import {
  EthereumOwnershipPCD,
  EthereumOwnershipPCDPackage,
  init,
} from "@pcd/ethereum-ownership-pcd";
import { useCallback, useState } from "react";
import { Button } from "./Button";
import { signMessage } from "@wagmi/core";
import { useAccount } from "wagmi";

/**
 * Proposes an Ethereum signature of your Semaphore public commitment.
 */
export function SignCommitmentButton({
  prompt,
  commitment,
  onSigned,
}: {
  prompt: string;
  commitment: string;
  onSigned: (signature: string) => void;
}) {
  const [signing, setSigning] = useState(false);
  const account = useAccount();

  const onClick = useCallback(
    async function () {
      if (account.address == null) throw new Error("No wallet connected");

      setSigning(true);
      const signature = await signMessage({
        message: commitment,
      });
      console.log("Got Ethereum signature", signature);
      setSigning(false);
      onSigned(signature);
    },
    [account.address, commitment, onSigned]
  );

  return (
    <Button onClick={onClick} disabled={signing}>
      {prompt}
    </Button>
  );
}
