import styles from "../Style/Header.module.css";

const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>Gerador de Certificados Personalizados</h1>
    <p className={styles.subtitle}>
      Crie certificados rapidamente a partir de templates prontos.
    </p>
    <p className={styles.instructions}>
      Basta carregar uma lista de nomes ou inserir manualmente e gerar certificados com design profissional.
    </p>

    {

      /**
       *     <button className={styles.ctaButton}>
                Comece Agora
              </button>
       * 
       */
    }

  </header>
);

export default Header;