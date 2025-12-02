import { useState } from "react";

// Login-side med fokus på tilgjengelighet
// Student B - støtteoppgave: Tilgjengelighet & UX
export default function Login() {
  // State for form-data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for validering og feilmeldinger
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validering av form - sjekker at felter ikke er tomme
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = "E-post er påkrevd";
    } else if (!email.includes("@")) {
      // Enkel e-post validering
      newErrors.email = "Ugyldig e-postadresse";
    }
    
    if (!password.trim()) {
      newErrors.password = "Passord er påkrevd";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Håndterer form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulerer login - senere erstattes med faktisk autentisering
      setTimeout(() => {
        setIsSubmitting(false);
        // TODO: Implementer faktisk login-logikk her
        console.log("Login attempt:", { email, password });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Logg inn
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tilgang til Echomedic risiko-dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* E-post input med label og aria-attributter */}
            <div>
              <label 
                htmlFor="email" 
                className="sr-only"
              >
                E-postadresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  // Fjerner feilmelding når bruker begynner å skrive
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email 
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10" 
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                } rounded-t-md focus:ring-2 focus:ring-offset-2`}
                placeholder="E-postadresse"
              />
              {/* Feilmelding for e-post */}
              {errors.email && (
                <p 
                  id="email-error" 
                  className="mt-2 text-sm text-red-600" 
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Passord input med label og aria-attributter */}
            <div>
              <label 
                htmlFor="password" 
                className="sr-only"
              >
                Passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  // Fjerner feilmelding når bruker begynner å skrive
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password 
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10" 
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                } rounded-b-md focus:ring-2 focus:ring-offset-2`}
                placeholder="Passord"
              />
              {/* Feilmelding for passord */}
              {errors.password && (
                <p 
                  id="password-error" 
                  className="mt-2 text-sm text-red-600" 
                  role="alert"
                  aria-live="polite"
                >
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit-knapp med loading state */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logger inn...
                </span>
              ) : (
                "Logg inn"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


