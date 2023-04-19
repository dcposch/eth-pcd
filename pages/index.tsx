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
          <li>
            <h2>Connect your wallet to create an Ethereum PCD.</h2>
            <div className={styles.instructionBody}>
              <ConnectButton />
            </div>
          </li>
          {account.status === "connected" && (
            <li>
              <h2>Login with your Zuzalu passport.</h2>
              <div className={styles.instructionBody}>
                <ZupassLoginButton
                  prompt={zuPCD ? "Logged in" : "Login with Passport"}
                  onLoggedIn={setZuPCD}
                />
              </div>
            </li>
          )}
          {account.status === "connected" &&
            zuPCD?.claim?.identityCommitment && (
              <li>
                <h2>Sign your Semaphore commitment.</h2>
                <div className={styles.instructionBody}>
                  <SignCommitmentButton
                    commitment={zuPCD.claim.identityCommitment}
                    prompt={ethSignature ? "Signed" : "Sign"}
                    onSigned={setEthSignature}
                  />
                </div>
              </li>
            )}
          {account.status === "connected" && zuPCD && ethSignature && (
            <li>
              <h2>Add Ethereum PCD to your passport.</h2>
              <div className={styles.instructionBody}>
                <AddToPassportButton
                  signature={ethSignature}
                  prompt={ethPCD ? "Done" : "Prove and add"}
                  onAdded={setEthPCD}
                />
              </div>
            </li>
          )}
        </ol>
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

export default Home;
