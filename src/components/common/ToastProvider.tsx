"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        success: {
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#00C853",
          },
        },
        error: {
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#fa3c4c",
          },
        },
      }}
    />
  );
}



