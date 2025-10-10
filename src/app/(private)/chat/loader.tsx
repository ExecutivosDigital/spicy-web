"use client";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};

export default Loader;
