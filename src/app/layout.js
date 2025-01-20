// app/layout.js
export const metadata = {
  title: 'Attendance Web App',
  description: 'A simple attendance app using Next.js and Firebase',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
