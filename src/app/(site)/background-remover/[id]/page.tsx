'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof params?.id === "string") {
      setId(params.id);
    } else if (Array.isArray(params?.id)) {
      setId(params.id[0]); // grab first value if array
    } else {
      setId(null);
    }
  }, [params]);

  if (id === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold">Invalid or missing ID</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Details (Client Only)</h1>
      <p>This page is rendered entirely on the client for ID: {id}</p>
    </div>
  );
}
