// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Welcome to Attendance Web App</h1>
      <p>This is the home page. Click the link below to mark attendance:</p>
      <Link href="/attendance" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Attendance Page
      </Link>
    </main>
  );
}
