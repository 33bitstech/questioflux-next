import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '5mb',
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Endereços antigos do blog (traduzidos por idioma) para o endereço único em inglês
  async redirects() {
    const moved: Record<string, string[]> = {
      'how-to-make-a-free-personality-quiz': ['como-criar-quiz-de-personalidade-gratis', 'como-crear-un-quiz-de-personalidad-gratis', 'personality-quiz-guide'],
      'how-to-create-an-online-test-with-answers-and-explanations': ['como-criar-teste-online-com-respostas-e-explicacoes', 'como-crear-un-examen-online-con-respuestas-y-explicaciones', 'online-test-guide'],
      'best-free-quiz-makers-compared': ['sites-para-criar-quizzes-gratis', 'sitios-para-crear-quizzes-gratis', 'free-quiz-makers-compared'],
    }
    return Object.entries(moved).map(([slug, old]) => ({
      source: `/:locale(en|pt|es|zh)/blog/:old(${old.join('|')})`,
      destination: `/:locale/blog/${slug}`,
      permanent: true,
    }))
  },
  // os artigos do blog são lidos do disco na hora: vão junto com as rotas que os usam
  outputFileTracingIncludes: {
    '/[locale]/blog': ['./src/content/blog/**/*'],
    '/[locale]/blog/[slug]': ['./src/content/blog/**/*'],
    '/sitemap.xml': ['./src/content/blog/**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quizvortex33.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'quizvortex.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ]
  }
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
