import Link from "next/link";
import { BrandLogo } from "./components/BrandLogo";
export default function NotFound() { return <main className="not-found"><BrandLogo /><p>404</p><h1>Bu sayfa bulunamadı.</h1><p>Bağlantı değişmiş veya adres hatalı olabilir.</p><Link className="primary-button" href="/">Ana sayfaya dön →</Link></main>; }
