import type { Metadata } from "next";
import { BlogIndex } from "../components/BlogIndex";

export const metadata: Metadata = { title: "Gizlilik, Prompt ve Veri Güvenliği Rehberleri", description: "Tarayıcı içi araçlar, KVKK, GDPR, prompt mühendisliği ve veri güvenliği için uygulamalı ByteQuant rehberleri.", alternates: { canonical: "/blog", languages: { "tr-TR": "/blog", "en-US": "/en/blog" } } };
export default function BlogPage() { return <BlogIndex locale="tr" />; }

