import {
  EthereumOwnershipPCD,
  EthereumOwnershipPCDPackage,
  init,
} from "@pcd/ethereum-ownership-pcd";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import { signMessage } from "@wagmi/core";
import { useAccount } from "wagmi";
import {
  constructPassportPcdProveAndAddRequestUrl,
  openPassportPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { PASSPORT_URL } from "../src/constants";
import { ArgumentTypeName, SerializedPCD } from "@pcd/pcd-types";
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd";

/**
 * Asks the user to prove-and-add a new Ethereum PCD to their Zuzalu passport.
 */
export function AddToPassportButton({
  prompt,
  signature,
  onAdded,
}: {
  prompt: string;
  signature: string;
  onAdded: (ethPCD: EthereumOwnershipPCD) => void;
}) {
  const [pending, setPending] = useState(false);
  const account = useAccount();

  // Pop up the passport window.
  const onClick = useCallback(() => {
    if (account.address == null) throw new Error("No wallet connected");
    setPending(true);
    addGroupMembershipProofPCD(account.address, signature);
  }, [account.address, signature]);

  // Wait for a response from the passport.
  const [pcdStr] = usePassportPopupMessages();
  useEffect(() => {
    if (!pending) return;
    if (!pcdStr) return;
    console.log("Got passport unknown response", pcdStr);
    const parsed = JSON.parse(pcdStr) as SerializedPCD;
    if (parsed.type !== EthereumOwnershipPCDPackage.name) return;

    (async function () {
      const pcd = await EthereumOwnershipPCDPackage.deserialize(parsed.pcd);
      console.log("Created Ethereum PCD, added to passport", pcd);
      setPending(false);
      onAdded(pcd);
    })();
  }, [onAdded, pcdStr, pending]);

  return (
    <Button onClick={onClick} disabled={pending}>
      {prompt}
    </Button>
  );
}

async function addGroupMembershipProofPCD(
  ethAddress: string,
  ethSignatureOfCommitment: string
) {
  const popupUrl = window.location.origin + "/popup";
  const proofUrl = constructPassportPcdProveAndAddRequestUrl<
    typeof EthereumOwnershipPCDPackage
  >(
    PASSPORT_URL,
    popupUrl,
    EthereumOwnershipPCDPackage.name,
    {
      identity: {
        argumentType: ArgumentTypeName.PCD,
        pcdType: SemaphoreIdentityPCDPackage.name,
        value: undefined,
        userProvided: true,
        description: "Your Zuzalu semaphore identity.",
      },
      ethereumAddress: {
        argumentType: ArgumentTypeName.String,
        value: ethAddress,
      },
      ethereumSignatureOfCommitment: {
        argumentType: ArgumentTypeName.String,
        value: ethSignatureOfCommitment,
      },
    },
    {
      genericProveScreen: true,
      description:
        "Generate a group membership proof using your passport's Semaphore Identity.",
      title: "Group Membership Proof",
    }
  );

  openPassportPopup(popupUrl, proofUrl);
}
