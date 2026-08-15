import './globals.css';

export const metadata = {
  title: 'Escudo Rosa - Canal Seguro de Apoio',
  description: 'Atendimento privativo e seguro para mulheres.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}