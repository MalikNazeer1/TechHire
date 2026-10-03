export const metadata = {
  title: 'Sign In',
  description: 'TechHire Sign In',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
