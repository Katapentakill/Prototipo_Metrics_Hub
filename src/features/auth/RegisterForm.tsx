'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  className?: string;
}

export default function RegisterForm({ className = '' }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push('/login?message=Registro completado. Por favor inicia sesión.');
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">Crear Cuenta</h1>
          <p className="text-muted">Únete a Living Stones como voluntario</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary border-b border-border-light pb-2">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="input-icon w-5 h-5" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="input-field has-icon w-full"
                    placeholder="Tu nombre"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <User className="input-icon w-5 h-5" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="input-field has-icon w-full"
                    placeholder="Tu apellido"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="input-icon w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field has-icon w-full"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="input-icon w-5 h-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="input-field has-icon w-full"
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label htmlFor="country" className="block text-sm font-medium text-secondary mb-2">
                  País
                </label>
                <div className="relative">
                  <MapPin className="input-icon w-5 h-5" />
                  <select
                    id="country"
                    name="country"
                    required
                    className="input-field has-icon w-full"
                    disabled={isLoading}
                  >
                    <option value="">Selecciona tu país</option>
                    <option value="US">Estados Unidos</option>
                    <option value="MX">México</option>
                    <option value="CO">Colombia</option>
                    <option value="AR">Argentina</option>
                    <option value="ES">España</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="city" className="block text-sm font-medium text-secondary mb-2">
                  Ciudad
                </label>
                <div className="relative">
                  <MapPin className="input-icon w-5 h-5" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="input-field has-icon w-full"
                    placeholder="Tu ciudad"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="birthDate" className="block text-sm font-medium text-secondary mb-2">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <Calendar className="input-icon w-5 h-5" />
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  className="input-field has-icon w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary border-b border-border-light pb-2">
              Seguridad
            </h3>

            <div className="input-group">
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="input-icon w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  className="input-field has-icon w-full pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="input-icon w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="input-field has-icon w-full pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary border-b border-border-light pb-2">
              Disponibilidad
            </h3>

            <div className="input-group">
              <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-secondary mb-2">
                Horas por semana
              </label>
              <select
                id="hoursPerWeek"
                name="hoursPerWeek"
                required
                className="input-field w-full"
                disabled={isLoading}
              >
                <option value="">Selecciona horas por semana</option>
                <option value="10">10 horas</option>
                <option value="20">20 horas</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="preferredHours" className="block text-sm font-medium text-secondary mb-2">
                Horario Preferido
              </label>
              <select
                id="preferredHours"
                name="preferredHours"
                required
                className="input-field w-full"
                disabled={isLoading}
              >
                <option value="">Selecciona horario</option>
                <option value="Mañanas">Mañanas</option>
                <option value="Tardes">Tardes</option>
                <option value="Noches">Noches</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-1 w-4 h-4 text-living-green-600 border-border-medium rounded focus:ring-living-green-500"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-secondary">
              Acepto los{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                política de privacidad
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-living w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="text-center">
          <div className="text-sm text-muted">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-primary hover:underline font-medium transition-colors">
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}