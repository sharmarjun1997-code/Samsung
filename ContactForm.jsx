import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const enquiryType = watch("enquiryType");
  const messageVal = watch("message") || "";
  const showConditional = enquiryType === "Business" || enquiryType === "Partnership";

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((c) => c.name.common).sort();
        setCountries(names);
      })
      .catch(() => setCountries(["United States", "United Kingdom", "India", "Canada", "Australia"]));
  }, []);

  useEffect(() => {
    if (!showConditional) {
      setValue("companyName", "");
      setValue("numEmployees", "");
    }
  }, [showConditional, setValue]);

  const STEP_FIELDS = {
    1: ["firstName", "lastName", "email", "phone", "dob", "country"],
    2: ["enquiryType", ...(showConditional ? ["companyName", "numEmployees"] : [])],
    3: ["subject", "message", "terms"],
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    setSubmitted(true);
  };

  const isAdult = (value) => {
    const dob = new Date(value);
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18 || "You must be at least 18 years old";
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-xl font-bold mb-2">Thank you!</h2>
          <p className="text-slate-500 text-sm">Your enquiry has been received. We'll get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Contact & Enquiry Form</h1>
        <p className="text-slate-500 text-sm mb-5">Step {step} of 3</p>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? "bg-indigo-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" error={errors.firstName}>
                  <input className="input" {...register("firstName", { required: "Required" })} />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input className="input" {...register("lastName", { required: "Required" })} />
                </Field>
              </div>
              <Field label="Email" error={errors.email}>
                <input
                  className="input"
                  type="email"
                  {...register("email", {
                    required: "Required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                  })}
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input className="input" type="tel" {...register("phone", { required: "Required" })} />
              </Field>
              <Field label="Date of Birth" error={errors.dob}>
                <input
                  className="input"
                  type="date"
                  {...register("dob", { required: "Required", validate: isAdult })}
                />
              </Field>
              <Field label="Country" error={errors.country}>
                <select className="input" {...register("country", { required: "Required" })}>
                  <option value="">Select country...</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <Field label="Enquiry Type" error={errors.enquiryType}>
                <select className="input" {...register("enquiryType", { required: "Required" })}>
                  <option value="">Select type...</option>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showConditional ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 pt-2">
                  <Field label="Company Name" error={errors.companyName}>
                    <input
                      className="input"
                      {...register("companyName", {
                        required: showConditional ? "Required" : false,
                      })}
                    />
                  </Field>
                  <Field label="Number of Employees" error={errors.numEmployees}>
                    <input
                      className="input"
                      type="number"
                      {...register("numEmployees", {
                        required: showConditional ? "Required" : false,
                      })}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <Field label="Subject" error={errors.subject}>
                <input className="input" {...register("subject", { required: "Required" })} />
              </Field>
              <Field label="Message" error={errors.message}>
                <textarea
                  className="input resize-none"
                  rows={4}
                  maxLength={500}
                  {...register("message", { required: "Required" })}
                />
                <p className="text-xs text-slate-400 text-right mt-1">{messageVal.length}/500</p>
              </Field>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" {...register("terms", { required: "You must accept the terms" })} />
                <span>I agree to the Terms & Conditions</span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300">
                Back
              </button>
            ) : <span />}

            {step < 3 ? (
              <button type="button" onClick={nextStep} className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600">
                Next
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
