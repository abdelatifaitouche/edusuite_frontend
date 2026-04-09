import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-4xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl shadow-blue-900/20 border-0 rounded-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* ── Left: Form ── */}
          <form className="flex flex-col justify-center px-8 py-12 md:px-12">
            <FieldGroup className="gap-6">

              {/* Logo + heading */}
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#1B3A6B] rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-xs tracking-wide">ECF</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black text-[#1B3A6B] tracking-wide leading-none">ECF-MONTRÉAL</div>
                    <div className="text-[10px] text-[#E8450A] uppercase tracking-widest leading-none mt-0.5">Centre de Formation</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">Bon retour !</h1>
                  <p className="text-sm text-slate-500 mt-1.5 font-light">
                    Connectez-vous à votre espace étudiant
                  </p>
                </div>
              </div>

              {/* Email */}
              <Field className="gap-2">
                <FieldLabel
                  htmlFor="email"
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                >
                  Adresse email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  className="h-11 bg-slate-50 border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/20 transition-all"
                />
              </Field>

              {/* Password */}
              <Field className="gap-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Mot de passe
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-xs text-[#E8450A] font-semibold hover:underline underline-offset-2 transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-11 bg-slate-50 border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/20 transition-all"
                />
              </Field>

              {/* Submit */}
              <Field className="mt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#E8450A] hover:bg-[#c73a08] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-orange-900/25 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 border-0"
                >
                  Se connecter →
                </Button>
              </Field>

              {/* Sign up link */}
              <FieldDescription className="text-center text-xs text-slate-500">
                Pas encore de compte ?{" "}
                <a href="#" className="text-[#1B3A6B] font-bold hover:underline underline-offset-2">
                  Créer un compte
                </a>
              </FieldDescription>

            </FieldGroup>
          </form>

          {/* ── Right: Visual panel ── */}
          <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-[#1B3A6B] via-[#0f2347] to-[#1a3560] p-10 overflow-hidden">
            {/* decorative circles */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#E8450A]/10" />
            <div className="absolute top-1/2 right-8 w-1 h-32 bg-white/10 rounded-full" />

            {/* Top badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#E8450A]/20 border border-[#E8450A]/30 rounded px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8450A]" />
                <span className="text-[#FFA07A] text-[10px] font-bold uppercase tracking-widest">
                  Espace Étudiant
                </span>
              </div>
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col gap-5">
              <div className="text-white/20 text-7xl font-black leading-none select-none">"</div>
              <blockquote className="text-white/80 text-base font-light leading-relaxed -mt-4">
                ECF Montréal a satisfait mes attentes. Bonne équipe, merci pour tout ce que j'ai pu apprendre durant ma formation.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-sm">
                  C
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Caroline R.</div>
                  <div className="text-white/45 text-xs uppercase tracking-wide">Secrétaire</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#E8450A] text-sm">★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
              {[
                { value: "15+",    label: "Ans d'exp." },
                { value: "2000+",  label: "Étudiants" },
                { value: "98%",    label: "Satisfaction" },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl font-black text-[#E8450A]">{s.value}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Footer note */}
      <FieldDescription className="text-center text-xs text-slate-400 px-4">
        En vous connectant, vous acceptez nos{" "}
        <a href="#" className="text-[#1B3A6B] font-semibold hover:underline underline-offset-2">
          Conditions d'utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="text-[#1B3A6B] font-semibold hover:underline underline-offset-2">
          Politique de confidentialité
        </a>
        .
      </FieldDescription>
    </div>
  )
}