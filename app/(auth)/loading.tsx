import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner className="h-8 w-8 border-brand-primary" />
    </div>
  );
}