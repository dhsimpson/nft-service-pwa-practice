/** @type {import('next').NextConfig} */
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')
const withPWA = require('next-pwa')({
        // disable: process.env.NODE_ENV === 'development',
        dest: 'public'
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
}

const envList = (phase) => {
    // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
    const isDev = phase === PHASE_DEVELOPMENT_SERVER || process.env.DEV === '1';
    // when `next build` or `npm run build` is used
    const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.DEV !== '1' && process.env.STAGING === '1';
    // when `next build` or `npm run build` is used
    const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.DEV !== '1' && process.env.STAGING !== '1';
    return {
        isDev, isStaging, isProd
    }
}

const getEnvSpecificValue = (isDev, isStaging, isProd, devValue, stagingValue, prodValue, defaultValue) => {
    if(isDev) {
        return devValue;
    }
    if(isStaging) {
        return stagingValue;
    }
    if(isProd) {
        return prodValue;
    }
    return `${defaultValue}:not (isDev,isProd && !isStaging,isProd && isStaging)`;
}

module.exports = (phase) => {
    const {isDev, isStaging, isProd} = envList(phase);

    console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)

    const env = {
        //TODO : staging 은 테스트넷 배포
        //TODO : prod 는 폴리곤넷 배포
        NEXT_PUBLIC_CONTRACT_ADDRESS: (() => {
            //스마트 컨트랙트의 주소를 각 환경에 맞게 입력 한다.
            return getEnvSpecificValue(isDev, isStaging, isProd, '0x5C41aEac153dF4E677cC56F6Ae18F4d70F432f7C', '0xa7c36691557704687c42540DC8675F8c91437535', '0xa7c36691557704687c42540DC8675F8c91437535', 'CONTRACT_ADDRESS');
        })(),
        NEXT_PUBLIC_ENV: (() => {
            return getEnvSpecificValue(isDev, isStaging, isProd, 'dev', 'staging', 'prod', 'ENV');
        })(),
        NEXT_PUBLIC_IPFS_HOST: (() => {
            return getEnvSpecificValue(isDev, isStaging, isProd, '127.0.0.1', '127.0.0.1', '127.0.0.1', 'IPFS_HOST');
        })(),
        NEXT_PUBLIC_IPFS_PORT: (() => {
            return getEnvSpecificValue(isDev, isStaging, isProd, '5002', '5002', '5002', 'IPFS_PORT');
        })(),
        NEXT_PUBLIC_IPFS_PROTOCOL: (() => {
            return getEnvSpecificValue(isDev, isStaging, isProd, 'http', 'https', 'https', 'IPFS_PROTOCOL');
        })(),
    }
    
    const pwaConfig = withPWA({
        env: {
            NEXT_PUBLIC_CONTRACT_ADDRESS: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            NEXT_PUBLIC_ENV: env.NEXT_PUBLIC_ENV,
            NEXT_PUBLIC_IPFS_HOST: env.NEXT_PUBLIC_IPFS_HOST,
            NEXT_PUBLIC_IPFS_PORT: env.NEXT_PUBLIC_IPFS_PORT,
            NEXT_PUBLIC_IPFS_PROTOCOL: env.NEXT_PUBLIC_IPFS_PROTOCOL,
        },
        ...nextConfig
    });

    return pwaConfig;
}
