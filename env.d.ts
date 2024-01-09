declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXT_PUBLIC_APP_URL: string
    APP_DOMAIN: string
    PEPPER: string
    SECRET_KEY: string
  }
}
