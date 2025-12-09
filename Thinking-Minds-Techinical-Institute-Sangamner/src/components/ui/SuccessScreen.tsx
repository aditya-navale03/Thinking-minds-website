import { CheckCircle } from "lucide-react";

interface SuccessScreenProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onClose?: () => void;
}

export default function SuccessScreen({
  title = "Success!",
  message = "Your action was completed successfully.",
  buttonText = "Continue",
  onClose
}: SuccessScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        <p className="text-gray-700 mt-2">{message}</p>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
