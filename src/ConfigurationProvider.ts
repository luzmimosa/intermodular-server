export const databaseOptions = {
    host: '127.0.0.1',
    port: 27017,
    database: 'intermodular',
    user: 'server',
    password: 'server'
};

export const serverOptions = {
    listeningPort: 443,
    sslKeyPath: './ssl/private.pem',
    sslCertPath: './ssl/certificate.pem',
    sslPassphrase: process.env.SSL_PASSPHRASE !!,

    httpsRedirectUrl: "intermodular.fadedbytes.com"
}

export const isProduction = () => {
    return (process.env.NODE_ENV ?? "development") === "production";
}