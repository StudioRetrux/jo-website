import Image from "next/image";
import { SIZES } from "../assets";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: image is the listing thumbnail — the same asset the card shows, so nothing
// new to load and no second field to keep in sync until real hero art exists.
export default function ProjectHero({
  image,
  alt,
  category,
  year,
  title,
  subtitle,
}: {
  image: string;
  alt: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className={styles.hero}>
      <Image src={image} alt={alt} fill priority sizes={SIZES.full} className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>
          {category}
          <span aria-hidden="true">{" • "}</span>
          {year}
        </p>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
