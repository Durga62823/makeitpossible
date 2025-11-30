export default function Home() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-6 py-16 dark:from-black dark:to-slate-900">
      <section className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-brand-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-primary">
            AI project operations
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Make every mission possible with autonomous project intelligence.
          </h1>
          <p className="text-lg text-slate-600">
            Align goals, automate workflows, and secure collaboration in one platform designed for enterprise PMOs. Powered by AI copilots, governed by Zero Trust.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30"
            >
              Launch your workspace
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-800"
            >
              Access console
            </a>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {["99.99% uptime", "SOC2 Type II", "1M+ users"].map((item) => (
              <div key={item}>
                <dt className="text-xs uppercase tracking-widest text-slate-400">Assurance</dt>
                <dd className="text-lg font-semibold text-slate-900">{item}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-brand-primary/10">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Enterprise-ready from day one</h2>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>- Role-based access control mapped to your org chart</li>
              <li>- OAuth2 SSO with Google & GitHub plus passwordless magic links</li>
              <li>- Real-time insights, capacity planning, and AI assistants per team</li>
              <li>- Audit-grade logging, device tracking, and automated compliance exports</li>
            </ul>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">"Make It Possible is our control center for global launches. AI proactively resolves risks while keeping security uncompromised."</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">Alexis Romero - VP, Delivery Excellence</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
