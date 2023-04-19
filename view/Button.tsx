import styles from "../styles/Home.module.css";

export const Button = function (props: React.ComponentProps<"button">) {
  return <button className={styles.button} {...props} />;
};
