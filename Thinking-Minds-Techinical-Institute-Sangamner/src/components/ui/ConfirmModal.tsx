import { Button } from "./button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {title}
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </Button>
        </div>

      </div>
    </div>
  );
}