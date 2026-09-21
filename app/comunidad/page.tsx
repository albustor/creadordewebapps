"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ComunidadPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/diagnostico");
  }, [router]);

  return null;
}
