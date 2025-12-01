import { cn } from "@/lib/utils";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { toast } from "sonner";
import SpiralPadPattern from "./SpiralPadPattern";

function CustomToast({
  message,
  toastId,
  variant = "success",
}: {
  message: string;
  toastId: string | number;
  variant?: "success" | "error" | "warning" | "info";
}) {
  const color =
    variant === "success"
      ? "text-green-500"
      : variant === "error"
      ? "text-red-500"
      : variant === "warning"
      ? "text-yellow-500"
      : "text-blue-500";

  const icon =
    variant === "success" ? (
      <Check className="size-4" />
    ) : variant === "error" ? (
      <X className="size-4" />
    ) : variant === "warning" ? (
      <AlertTriangle className="size-4" />
    ) : (
      <Info className="size-4" />
    );

  return (
    <div className="relative" onClick={() => toast.dismiss(toastId)}>
      <SpiralPadPattern className="bg-white" size={20} />
      <div
        className={cn(
          "bg-white p-4 shadow-lg text-center font-crayon flex items-center gap-2",
          color
        )}
      >
        {icon} {message}
      </div>
      <SpiralPadPattern className="bg-white" size={20} />
    </div>
  );
}

export function customToast(
  message: string,
  variant: "success" | "error" | "warning" | "info" = "success"
) {
  toast.custom((toastId) => (
    <CustomToast message={message} toastId={toastId} variant={variant} />
  ));
}
