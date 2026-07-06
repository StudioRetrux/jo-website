import styles from "./work.module.css";

type Props = {
  text: string;
};

export default function ItemMenuText({ text }: Props) {
  return (
    <span className={styles.itemMenuTextClip}>
      <span className={styles.itemMenuTextTrack}>
        <span className={styles.itemMenuText}>{text}</span>
        <span className={`${styles.itemMenuText} ${styles.itemMenuTextHover}`}>{text}</span>
      </span>
    </span>
  );
}
