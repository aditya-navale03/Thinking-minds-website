import { ReactNode } from "react";

export default function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h1>

        {/* Buttons container */}
        <div className="grid grid-cols-1 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
