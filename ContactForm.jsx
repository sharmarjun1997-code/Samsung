import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const STEPS = ["Personal Info", "Enquiry Details", "Message"];

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const enquiryType = watch("enquiryType");
  const messageVal = watch("message") || "";
  const showConditional = enquiryType === "Business" || enquiryType === "Partnership";

  // Fetch countries from REST Countries API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((c) => c.name.common).sort();
        setCountries(names);
      })
      .catch(() => {
        setCountries([
          "Australia", "Brazil", "Canada", "China", "France",
          "Germany", "India", "Japan", "Mexico", "Netherlands",
          "Singapore", "South Africa", "United Kingdom", "United States",
        ]);
      });
  }, []);

  // Clear conditional fields when not applicable
  useEffect(() => {
    if (!showConditional) {
      setValue("companyName", "");
      setValue("numEmployees", "");
    }
  }, [showConditional, setValue]);

  const STEP_FIELDS = {
    1: ["firstName", "lastName", "email", "phone", "dob", "country"],
    2: showConditional
      ? ["enquiryType", "companyName", "numEmployees"]
      : ["enquiryType"],
    3: ["subject", "message", "terms"],
  };

  const validateAge = (value) => {
    const dob = new Date(value);
    const today = new Date();
    const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18 || "You must be at least 18 years old";
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API call
    console.log("Form submitted:", data);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your enquiry has been submitted successfully. We'll get back to you within 24–48 hours.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-1 mb-6">
            <p><strong>Name:</strong> {getValues("firstName")} {getValues("lastName")}</p>
            <p><strong>Email:</strong> {getValues("email")}</p>
            <p><strong>Enquiry:</strong> {getValues("enquiryType")}</p>
            <p><strong>Subject:</strong> {getValues("subject")}</p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 pt-8 pb-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Contact & Enquiry</h1>
          <p className="text-indigo-200 text-sm">Step {step} of 3 — {STEPS[step - 1]}</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-5">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-white transition-all duration-500 ${
                    i + 1 <= step ? "w-full" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {STEPS.map((label, i) => (
              <span key={i} className={`text-xs ${i + 1 <= step ? "text-white" : "text-indigo-300"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">

          {/* ─── STEP 1: Personal Info ─── */}
          {step === 1 && (
            <div className="space-y-4 animate-[fadeSlide_0.25s_ease-out]">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" error={errors.firstName}>
                  <input
                    className={input(errors.firstName)}
                    placeholder="John"
                    {...register("firstName", { required: "First name is required" })}
                  />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input
                    className={input(errors.lastName)}
                    placeholder="Doe"
                    {...register("lastName", { required: "Last name is required" })}
                  />
                </Field>
              </div>

              <Field label="Email Address" error={errors.email}>
                <input
                  className={input(errors.email)}
                  type="email"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <input
                  className={input(errors.phone)}
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[\d\s\-().]{7,15}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                />
              </Field>

              <Field label="Date of Birth" error={errors.dob}>
                <input
                  className={input(errors.dob)}
                  type="date"
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  {...register("dob", {
                    required: "Date of birth is required",
                    validate: validateAge,
                  })}
                />
              </Field>

              <Field label="Country" error={errors.country}>
                <select
                  className={input(errors.country)}
                  {...register("country", { required: "Country is required" })}
                >
                  <option value="">Select your country...</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {/* ─── STEP 2: Enquiry Details ─── */}
          {step === 2 && (
            <div className="space-y-4 animate-[fadeSlide_0.25s_ease-out]">
              <Field label="Enquiry Type" error={errors.enquiryType}>
                <select
                  className={input(errors.enquiryType)}
                  {...register("enquiryType", { required: "Please select an enquiry type" })}
                >
                  <option value="">Choose enquiry type...</option>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              {/* Conditional Business / Partnership Fields */}
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  showConditional ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 pt-1">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-600 font-medium">
                    ℹ️ Additional details required for {enquiryType} enquiries
                  </div>
                  <Field label="Company Name" error={errors.companyName}>
                    <input
                      className={input(errors.companyName)}
                      placeholder="Your company name"
                      {...register("companyName", {
                        required: showConditional ? "Company name is required" : false,
                      })}
                    />
                  </Field>
                  <Field label="Number of Employees" error={errors.numEmployees}>
                    <select
                      className={input(errors.numEmployees)}
                      {...register("numEmployees", {
                        required: showConditional ? "Please select company size" : false,
                      })}
                    >
                      <option value="">Select company size...</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="500+">500+</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Message ─── */}
          {step === 3 && (
            <div className="space-y-4 animate-[fadeSlide_0.25s_ease-out]">
              <Field label="Subject" error={errors.subject}>
                <input
                  className={input(errors.subject)}
                  placeholder="Brief subject of your enquiry"
                  {...register("subject", {
                    required: "Subject is required",
                    minLength: { value: 5, message: "Subject must be at least 5 characters" },
                  })}
                />
              </Field>

              <Field label="Message" error={errors.message}>
                <textarea
                  className={`${input(errors.message)} resize-none`}
                  rows={5}
                  maxLength={500}
                  placeholder="Describe your enquiry in detail..."
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 20, message: "Please write at least 20 characters" },
                  })}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-400">Min. 20 characters</span>
                  <span className={`text-xs font-medium ${messageVal.length > 450 ? "text-red-500" : "text-slate-400"}`}>
                    {messageVal.length}/500
                  </span>
                </div>
              </Field>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-indigo-500 rounded shrink-0"
                  {...register("terms", { required: "You must accept the Terms & Conditions" })}
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-500 underline hover:text-indigo-700">Terms & Conditions</a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-500 underline hover:text-indigo-700">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠️</span> {errors.terms.message}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-indigo-500/30"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 active:scale-95 transition-all shadow-md shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "✓ Submit Enquiry"
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Reusable Field wrapper
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠️</span> {error.message}
        </p>
      )}
    </div>
  );
}

// Dynamic input class helper
function input(error) {
  return `w-full border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 bg-white
    ${error
      ? "border-red-400 focus:ring-2 focus:ring-red-300"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
    }`;
}
