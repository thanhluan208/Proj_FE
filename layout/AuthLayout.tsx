import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-[url('/images/auth/auth-layout-bg.png')] dark:bg-[url('/images/auth/auth-layout-bg-dark.png')] bg-cover bg-center bg-no-repeat flex-col items-center justify-center min-h-screen py-10 px-4">
      {children}
    </div>
  );
};

export default AuthLayout;
