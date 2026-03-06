"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Por favor complete todos los campos")
      return
    }
    const success = login(email, password)
    if (!success) {
      setError("Credenciales invalidas. Intente de nuevo.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Award className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Premio Eduardo Abaroa
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Premio Nacional de Cultura
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-lg border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Iniciar Sesion
            </CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contrasena
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="h-11 w-full mt-2 font-medium">
                Ingresar
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Credenciales de prueba:
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">Admin:</span>
                  <span className="tabular-nums">admin@premioeduardoabaroa.bo / admin123</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">Coordinador:</span>
                  <span className="tabular-nums">coordinador@premioeduardoabaroa.bo / coord123</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">Jurado:</span>
                  <span className="tabular-nums">jurado1@premioeduardoabaroa.bo / jurado123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Estado Plurinacional de Bolivia &middot; Ministerio de Culturas
        </p>
      </div>
    </div>
  )
}
