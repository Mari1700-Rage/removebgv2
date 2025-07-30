"use client";

import { useEffect, useState } from "react";

export default function ImageDetailsClient({ id }: { id: string }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const runRemover = async () => {
      try {
        // background remover logic here
        console.log("Running remover for ID:", id);
        setStatus("complete");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    runRemover();
  }, [id]);

  return (
    <div>
      <p className="text-gray-600">
        Processing image ID: <strong>{id}</strong>
      </p>
      <p>Status: {status}</p>
    </div>
  );
}
