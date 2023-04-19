import { SemaphoreSignaturePCD } from "@pcd/semaphore-signature-pcd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";
import styles from "../styles/Home.module.css";
import { ZupassLoginButton } from "../view/ZupassLoginButton";
import { SignCommitmentButton } from "../view/SignCommitmentButton";
import { EthereumOwnershipPCD } from "@pcd/ethereum-ownership-pcd";
import { AddToPassportButton } from "../view/AddToPassportButton";
import { PASSPORT_URL } from "../src/constants";

const Home: NextPage = () => {
  const account = useAccount();

  const [zuPCD, setZuPCD] = useState<SemaphoreSignaturePCD | null>(null);
  const [ethSignature, setEthSignature] = useState<string | null>(null);
  const [ethPCD, setEthPCD] = useState<EthereumOwnershipPCD | null>(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ethereum PCD</title>
        <meta
          content="Add an Ethereum PCD to your passport"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <h1>
          Ξ<br />
          Ethereum PCD
        </h1>
        <ol className={styles.instructionList}>
          <Instruction
            title="Connect your wallet to create an Ethereum PCD."
            enabled={true}
          >
            <ConnectButton showBalance={false} />
          </Instruction>
          <Instruction
            title="Login with your Zuzalu passport."
            enabled={account.status === "connected"}
          >
            {!zuPCD && (
              <ZupassLoginButton
                prompt={"Login with Passport"}
                onLoggedIn={setZuPCD}
              />
            )}
            {zuPCD && <h3>✅ Zuzalu participant</h3>}
          </Instruction>
          <Instruction
            title="Sign your Semaphore commitment."
            enabled={account.status === "connected" && zuPCD != null}
          >
            {zuPCD && !ethSignature && (
              <SignCommitmentButton
                commitment={zuPCD.claim.identityCommitment}
                prompt={"Sign"}
                onSigned={setEthSignature}
              />
            )}
            {ethSignature && <h3>✅ Signed</h3>}
          </Instruction>
          <Instruction
            title="Add Ethereum PCD to your passport."
            enabled={ethSignature != null}
          >
            {ethSignature && !ethPCD && (
              <AddToPassportButton
                signature={ethSignature}
                prompt={"Prove and add"}
                onAdded={setEthPCD}
              />
            )}
            {ethPCD && <h3>✅ Added</h3>}
          </Instruction>
        </ol>
        <h2>
          {!ethPCD && <>&nbsp;</>}
          {ethPCD && (
            <a href={PASSPORT_URL} rel="noreferrer" target="_blank">
              Done
            </a>
          )}
        </h2>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/proofcarryingdata/zupass"
          rel="noopener noreferrer"
          target="_blank"
        >
          Built with the 0xPARC PCD SDK
        </a>
        <a
          href="https://github.com/dcposch/eth-pcd"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github dcposch/eth-pcd
        </a>
      </footer>
    </div>
  );
};

function Instruction({
  title,
  enabled,
  children,
}: {
  title: string;
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={
        enabled ? styles.instructionEnabled : styles.instructionDisabled
      }
    >
      <h2>{title}</h2>
      <div className={styles.instructionBody}>{enabled && children}</div>
    </li>
  );
}

export default Home;
