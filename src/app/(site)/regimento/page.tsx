"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

/** Rota antiga do protótipo — a página agora se chama Estatuto. */
export default function Page() {
  const router = useRouter();
  useEffect(() => { router.replace("/estatuto"); }, [router]);
  return <p style={{ padding: "120px 24px" }}>Redirecionando para o <Link href="/estatuto">Estatuto</Link>…</p>;
}
