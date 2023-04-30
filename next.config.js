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
            return getEnvSpecificValue(isDev, isStaging, isProd, '0x805A73d871a26415fa0117Ec3C7988C86e4f78Ea', '0x805A73d871a26415fa0117Ec3C7988C86e4f78Ea', '0x805A73d871a26415fa0117Ec3C7988C86e4f78Ea', 'CONTRACT_ADDRESS');
        })(),
        NEXT_PUBLIC_ENV: (() => {
            return getEnvSpecificValue(isDev, isStaging, isProd, 'dev', 'staging', 'prod', 'ENV');
        })()
    }
    
    const pwaConfig = withPWA({
        env: {
            NEXT_PUBLIC_CONTRACT_ADDRESS: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            NEXT_PUBLIC_ENV: env.NEXT_PUBLIC_ENV
        },
        ...nextConfig
    });

    return pwaConfig;
}
