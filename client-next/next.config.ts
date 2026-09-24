/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Toda petición que empiece con /api/v1/
        source: '/api/v1/:path*',
        // Se redirigirá internamente al contenedor mastery_api (puerto 3000)
        destination: 'http://mastery_api:3000/api/v1/:path*',
      },
    ];
  },
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000, 
      aggregateTimeout: 300,
    }
    return config
  },
};

export default nextConfig;