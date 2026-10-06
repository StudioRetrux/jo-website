import ProjectText from "./ProjectText";
import styles from "./[slug]/projectDetail.module.css";

// ponytail: three identical columns, exactly as the mock has them.
const NAMES = ["Yohanes Alexander", "Muhammad Faldi", "Jasmine Tandiani", "Virgo Manon"];
const COLUMNS = [NAMES, NAMES, NAMES];

export default function ProjectCredits() {
  return (
    <section className={styles.credits}>
      <ProjectText as="span" className={styles.creditsLabel}>(MEET THE TEAM)</ProjectText>
      <div className={styles.creditsColumns}>
        {COLUMNS.map((names, i) => (
          <div className={styles.creditsColumn} key={i}>
            {names.map((name) => (
              <ProjectText as="span" key={name}>{name}</ProjectText>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
