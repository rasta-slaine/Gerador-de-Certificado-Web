
import styles from "../style/Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <p className={styles.text}>
        © {new Date().getFullYear()} Nathan Dev - Todos os direitos reservados.
      </p>
      <ul className={styles.socialLinks}>
        <li>
          <a
            href="https://www.linkedin.com/in/nathan-das-chagas-santos-862179185"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://github.com/rasta-slaine"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="mailto: quiknathan7@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contato
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;