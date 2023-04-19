import {
  openSignedZuzaluUUIDPopup,
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { useEffect, useState } from "react";
import { PASSPORT_URL } from "../src/constants";
import { Button } from "./Button";
import {
  SemaphoreSignaturePCD,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { PCD, SerializedPCD } from "@pcd/pcd-types";

/**
 * Identity-revealing Zuzalu login. Returns a semaphore-signature-pcd.
 */
export function ZupassLoginButton({
  onLoggedIn,
  prompt,
}: {
  onLoggedIn: (pcd: SemaphoreSignaturePCD) => void;
  prompt: string;
}) {
  const [loggingIn, setLoggingIn] = useState(false);

  const [pcdStr] = usePassportPopupMessages();

  useEffect(() => {
    if (!loggingIn) return;
    if (!pcdStr) return;
    const parsed = JSON.parse(pcdStr) as SerializedPCD;
    if (parsed.type !== SemaphoreSignaturePCDPackage.name) return;

    (async function () {
      const pcd = await SemaphoreSignaturePCDPackage.deserialize(parsed.pcd);
      console.log("Got Zuzalu PCD", pcd);
      setLoggingIn(false);
      onLoggedIn(pcd);
    })();
  }, [pcdStr, loggingIn, onLoggedIn]);

  return (
    <Button
      onClick={() => {
        setLoggingIn(true);
        openSignedZuzaluUUIDPopup(
          PASSPORT_URL,
          window.location.origin + "/popup",
          "eth-pcd"
        );
      }}
      disabled={loggingIn}
    >
      {prompt}
    </Button>
  );
}
