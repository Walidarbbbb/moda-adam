/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // En esta demo mostramos las fotos de producto con etiquetas <img> normales.
  // Pero dejamos configurado esto por si en el futuro usas el componente
  // optimizado <Image> de Next con fotos alojadas en cualquier servidor.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
