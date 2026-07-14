import Link from "next/link";
export default function NotFound() { return <main className="not-found"><span className="brand-mark">BQ</span><p>404</p><h1>Bu sayfa bulunamadı.</h1><p>Bağlantı değişmiş veya adres hatalı olabilir.</p><Link className="primary-button" href="/">Ana sayfaya dön →</Link></main>; }

