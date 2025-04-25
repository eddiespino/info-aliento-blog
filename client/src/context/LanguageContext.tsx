import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Load translations only once to avoid recreating this object on every render
  const translations = {
    en: {
      // Header
      'nav.home': 'Home',
      'nav.witnesses': 'Witnesses',
      'nav.about': 'About',
      'login': 'Login',
      'logout': 'Logout',
      'language': 'Language',
      'english': 'English',
      'spanish': 'Spanish',
      
      // Home page
      'home.title': 'Welcome to Hive Witness Explorer',
      'home.description': 'Discover Hive blockchain witnesses, their profiles, and voting power.',
      'home.featured': 'Featured Witness',
      'home.network': 'Network Status',
      'home.networkDesc': 'Current state of the Hive blockchain',
      'home.networkHeight': 'Block Height',
      'home.networkTx': 'Transactions / Day',
      'home.networkWitnesses': 'Active Witnesses',
      'home.networkPrice': 'Hive Price',
      'home.viewAll': 'View All Witnesses',
      
      // Witnesses page
      'witnesses.title': 'Hive Witnesses',
      'witnesses.description': 'Witnesses secure the Hive blockchain and produce blocks. They play a crucial role in governance and blockchain development.',
      'witnesses.search': 'Search witnesses',
      'witnesses.rank': 'Rank',
      'witnesses.name': 'Name',
      'witnesses.votes': 'Votes',
      'witnesses.lastBlock': 'Last Block',
      'witnesses.missedBlocks': 'Missed',
      'witnesses.fee': 'Fee',
      'witnesses.version': 'Version',
      'witnesses.loading': 'Loading witnesses...',
      'witnesses.viewProfile': 'View Profile',
      'witnesses.vote': 'Vote',
      'witnesses.showing': 'Showing',
      'witnesses.of': 'of',
      
      // Witness profile page
      'profile.notFound': 'Witness Not Found',
      'profile.wasNotFound': 'The witness',
      'profile.viewAll': 'View All Witnesses',
      'profile.overview': 'Overview',
      'profile.voters': 'Voters',
      'profile.about': 'About',
      'profile.stats': 'Statistics',
      'profile.witnessInfo': 'Witness Information',
      'profile.rank': 'Rank',
      'profile.votes': 'Votes',
      'profile.votePower': 'Voting Power',
      'profile.lastBlock': 'Last Block',
      'profile.missedBlocks': 'Missed Blocks',
      'profile.fee': 'Fee',
      'profile.created': 'Account Created',
      'profile.reliability': 'Reliability',
      'profile.reliability.desc': 'A lower number of missed blocks indicates better reliability and uptime.',
      'profile.failed': 'Failed to load witness data.',
      'profile.votersTitle': 'Voters',
      'profile.account': 'Account',
      'profile.username': 'Username',
      'profile.ownHP': 'Own HP',
      'profile.proxiedHP': 'Proxied HP',
      'profile.totalGov': 'Total governance vote',
      'profile.noVoters': 'No voters found for this witness.',
      
      // Modals
      'modal.login.title': 'Login with Hive Keychain',
      'modal.login.desc': 'Please enter your Hive username to login with Keychain.',
      'modal.login.username': 'Hive Username',
      'modal.login.enterUsername': 'Enter your username',
      'modal.login.action': 'Login with Keychain',
      'modal.login.keychain': 'Hive Keychain is required',
      'modal.login.keychainDesc': 'You need to install the Hive Keychain browser extension to login.',
      'modal.login.install': 'Install Keychain',
      'modal.login.cancel': 'Cancel',
      
      'modal.vote.title': 'Vote for Witness',
      'modal.vote.desc': 'You are about to vote for',
      'modal.vote.approve': 'Approve',
      'modal.vote.remove': 'Remove Vote',
      'modal.vote.cancel': 'Cancel',
      'modal.vote.warning': 'Warning',
      'modal.vote.warningDesc': 'You can only vote for up to 30 witnesses. Please remove a vote first if you\'ve reached your limit.',
      
      'modal.proxy.title': 'Accounts that have chosen',
      'modal.proxy.desc': 'These accounts have delegated their witness voting power to',
      'modal.proxy.desc2': 'Proxy relationships may change frequently on the Hive blockchain.',
      'modal.proxy.undiscovered': 'Undiscovered Accounts',
      'modal.proxy.proxyPower': 'Total proxy power:',
      'modal.proxy.explanation': 'This account has proxied votes, but we couldn\'t identify specific accounts. The Hive blockchain doesn\'t provide a direct way to query this relationship.',
      'modal.proxy.noAccounts': 'No accounts are currently using',
      'modal.proxy.asProxy': 'as their proxy',
      'modal.proxy.relationships': 'Proxy relationships on Hive may change over time. Our system uses multiple methods to find proxy relationships, including direct blockchain queries and cached data.',
      
      // About page
      'about.title': 'About Hive Witness Explorer',
      'about.description': 'A comprehensive tool for exploring Hive blockchain witnesses.',
      'about.purpose': 'Purpose',
      'about.purposeDesc': 'This application provides an easy way to discover, evaluate, and vote for Hive witnesses - the blockchain validators who secure the network and implement governance decisions.',
      'about.features': 'Features',
      'about.feature1': 'View detailed witness profiles',
      'about.feature2': 'See witness voters and their influence',
      'about.feature3': 'Explore proxy relationships',
      'about.feature4': 'Vote for witnesses securely using Hive Keychain',
      'about.tech': 'Technology',
      'about.techDesc': 'Built with React, Vite, and integrated with the Hive blockchain through direct API calls and Hive Keychain authentication.',
    },
    es: {
      // Header
      'nav.home': 'Inicio',
      'nav.witnesses': 'Testigos',
      'nav.about': 'Acerca de',
      'login': 'Iniciar sesión',
      'logout': 'Cerrar sesión',
      'language': 'Idioma',
      'english': 'Inglés',
      'spanish': 'Español',
      
      // Home page
      'home.title': 'Bienvenido al Explorador de Testigos de Hive',
      'home.description': 'Descubre los testigos de la blockchain Hive, sus perfiles y poder de voto.',
      'home.featured': 'Testigo Destacado',
      'home.network': 'Estado de la Red',
      'home.networkDesc': 'Estado actual de la blockchain Hive',
      'home.networkHeight': 'Altura del Bloque',
      'home.networkTx': 'Transacciones / Día',
      'home.networkWitnesses': 'Testigos Activos',
      'home.networkPrice': 'Precio de Hive',
      'home.viewAll': 'Ver Todos los Testigos',
      
      // Witnesses page
      'witnesses.title': 'Testigos de Hive',
      'witnesses.description': 'Los testigos aseguran la blockchain Hive y producen bloques. Juegan un papel crucial en la gobernanza y el desarrollo de la blockchain.',
      'witnesses.search': 'Buscar testigos',
      'witnesses.rank': 'Rango',
      'witnesses.name': 'Nombre',
      'witnesses.votes': 'Votos',
      'witnesses.lastBlock': 'Último Bloque',
      'witnesses.missedBlocks': 'Perdidos',
      'witnesses.fee': 'Tarifa',
      'witnesses.version': 'Versión',
      'witnesses.loading': 'Cargando testigos...',
      'witnesses.viewProfile': 'Ver Perfil',
      'witnesses.vote': 'Votar',
      'witnesses.showing': 'Mostrando',
      'witnesses.of': 'de',
      
      // Witness profile page
      'profile.notFound': 'Testigo No Encontrado',
      'profile.wasNotFound': 'El testigo',
      'profile.viewAll': 'Ver Todos los Testigos',
      'profile.overview': 'Resumen',
      'profile.voters': 'Votantes',
      'profile.about': 'Acerca de',
      'profile.stats': 'Estadísticas',
      'profile.witnessInfo': 'Información del Testigo',
      'profile.rank': 'Rango',
      'profile.votes': 'Votos',
      'profile.votePower': 'Poder de Voto',
      'profile.lastBlock': 'Último Bloque',
      'profile.missedBlocks': 'Bloques Perdidos',
      'profile.fee': 'Tarifa',
      'profile.created': 'Cuenta Creada',
      'profile.reliability': 'Fiabilidad',
      'profile.reliability.desc': 'Un menor número de bloques perdidos indica mejor fiabilidad y tiempo de actividad.',
      'profile.failed': 'Error al cargar datos del testigo.',
      'profile.votersTitle': 'Votantes',
      'profile.account': 'Cuenta',
      'profile.username': 'Nombre de usuario',
      'profile.ownHP': 'HP Propio',
      'profile.proxiedHP': 'HP Delegado',
      'profile.totalGov': 'Voto total de gobernanza',
      'profile.noVoters': 'No se encontraron votantes para este testigo.',
      
      // Modals
      'modal.login.title': 'Iniciar sesión con Hive Keychain',
      'modal.login.desc': 'Por favor, ingresa tu nombre de usuario de Hive para iniciar sesión con Keychain.',
      'modal.login.username': 'Nombre de usuario de Hive',
      'modal.login.enterUsername': 'Ingresa tu nombre de usuario',
      'modal.login.action': 'Iniciar sesión con Keychain',
      'modal.login.keychain': 'Se requiere Hive Keychain',
      'modal.login.keychainDesc': 'Necesitas instalar la extensión de navegador Hive Keychain para iniciar sesión.',
      'modal.login.install': 'Instalar Keychain',
      'modal.login.cancel': 'Cancelar',
      
      'modal.vote.title': 'Votar por Testigo',
      'modal.vote.desc': 'Estás a punto de votar por',
      'modal.vote.approve': 'Aprobar',
      'modal.vote.remove': 'Eliminar Voto',
      'modal.vote.cancel': 'Cancelar',
      'modal.vote.warning': 'Advertencia',
      'modal.vote.warningDesc': 'Solo puedes votar por hasta 30 testigos. Por favor, elimina un voto primero si has alcanzado tu límite.',
      
      'modal.proxy.title': 'Cuentas que han elegido a',
      'modal.proxy.desc': 'Estas cuentas han delegado su poder de voto de testigos a',
      'modal.proxy.desc2': 'Las relaciones de proxy pueden cambiar frecuentemente en la blockchain Hive.',
      'modal.proxy.undiscovered': 'Cuentas No Descubiertas',
      'modal.proxy.proxyPower': 'Poder de proxy total:',
      'modal.proxy.explanation': 'Esta cuenta tiene votos delegados, pero no pudimos identificar cuentas específicas. La blockchain Hive no proporciona una forma directa de consultar esta relación.',
      'modal.proxy.noAccounts': 'Actualmente no hay cuentas utilizando a',
      'modal.proxy.asProxy': 'como su proxy',
      'modal.proxy.relationships': 'Las relaciones de proxy en Hive pueden cambiar con el tiempo. Nuestro sistema utiliza múltiples métodos para encontrar relaciones de proxy, incluyendo consultas directas a la blockchain y datos en caché.',
      
      // About page
      'about.title': 'Acerca del Explorador de Testigos de Hive',
      'about.description': 'Una herramienta completa para explorar los testigos de la blockchain Hive.',
      'about.purpose': 'Propósito',
      'about.purposeDesc': 'Esta aplicación proporciona una manera fácil de descubrir, evaluar y votar por los testigos de Hive - los validadores de la blockchain que aseguran la red e implementan decisiones de gobernanza.',
      'about.features': 'Características',
      'about.feature1': 'Ver perfiles detallados de testigos',
      'about.feature2': 'Ver votantes de testigos y su influencia',
      'about.feature3': 'Explorar relaciones de proxy',
      'about.feature4': 'Votar por testigos de forma segura usando Hive Keychain',
      'about.tech': 'Tecnología',
      'about.techDesc': 'Construido con React, Vite e integrado con la blockchain Hive a través de llamadas API directas y autenticación Hive Keychain.',
    }
  };

  const translate = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}