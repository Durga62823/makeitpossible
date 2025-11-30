interface EmailVerificationNoticeProps {
  email?: string;
}

export function EmailVerificationNotice({ email }: EmailVerificationNoticeProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      We sent a secure link to <span className="font-medium">{email ?? "your inbox"}</span>. Please verify your
      email to activate your workspace.
    </div>
  );
}
