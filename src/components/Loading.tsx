import React from "react";
import { Spinner } from "./Spinner";

export const Loading = () => {
  return (
    <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center">
      <Spinner />
    </div>
  );
};
