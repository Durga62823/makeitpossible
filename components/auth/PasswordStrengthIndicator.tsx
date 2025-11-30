"use client";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const rules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One special character", test: (value: string) => /[!@#$%^&*()_+\-={}\[\]:;"'`~<>,.?/]/.test(value) },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const passed = rules.filter((rule) => rule.test(password)).length;
  const strength = (passed / rules.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="rounded-full bg-brand-accent transition-all"
          style={{ width: `${strength}%` }}
        />
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {rules.map((rule) => (
          <li key={rule.label} className={rule.test(password) ? "text-brand-accent" : undefined}>
            - {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
