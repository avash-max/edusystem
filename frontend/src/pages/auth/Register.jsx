import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, 
  GraduationCap, BookOpen, CheckCircle2, 
  ArrowRight, ArrowLeft, School, Loader2 
} from 'lucide-react';
import { createUserApi } from '../../services/api';

export default function Register() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('student'); // student | teacher
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '',
    subject: '',
    school: '',
    role: ''
  });

  const navigate = useNavigate();

  // Color Mapping based on Role
  const isStudent = userType === 'student';
  const theme = {
    primary: isStudent ? 'blue-600' : 'orange-600',
    hover: isStudent ? 'hover:bg-blue-700' : 'hover:bg-orange-700',
    bg: isStudent ? 'bg-blue-50' : 'bg-orange-50',
    border: isStudent ? 'focus:border-blue-600' : 'focus:border-orange-600',
    gradient: isStudent ? 'from-blue-600 to-indigo-600' : 'from-orange-600 to-red-600'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid format";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords don't match" });
      return;
    }

    setLoading(true);

    // Prepare Payload for Backend
    const payload = {
      username: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: userType,
      info: JSON.stringify({
        school: formData.school,
        gradeLevel: isStudent ? formData.gradeLevel : null,
        subject: !isStudent ? formData.subject : null,
        fullName: `${formData.firstName} ${formData.lastName}`
      })
    };

    try {
      const response = await createUserApi(payload);
      if (response.data.success) {
        setStep(3); // Success Screen
      } else {
        setErrors({ server: response.data.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ server: error.response?.data?.message || "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Progress Tracker */}
        {step < 3 && (
          <div className="flex justify-center mb-8 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= i ? `bg-${theme.primary}` : 'bg-slate-200'}`} />
            ))}
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 transition-all">
          
          {step === 3 ? (
            <SuccessState theme={theme} firstName={formData.firstName} />
          ) : (
            <div className="space-y-6">
              <header className="text-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-slate-500 font-medium mt-1">Join the EduLearn community</p>
              </header>

              {/* Role Switcher */}
              {step === 1 && (
                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                  <button onClick={() => setUserType('student')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${isStudent ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
                    <GraduationCap size={18} /> Student
                  </button>
                  <button onClick={() => setUserType('teacher')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${!isStudent ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>
                    <BookOpen size={18} /> Teacher
                  </button>
                </div>
              )}

              {errors.server && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl">
                  {errors.server}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Jane" theme={theme} />
                      <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" theme={theme} />
                    </div>
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="jane@edu.com" icon={<Mail size={18}/>} theme={theme} />
                    <InputField label="Institution" name="school" value={formData.school} onChange={handleChange} placeholder="University Name" icon={<School size={18}/>} theme={theme} />
                    
                    <button type="button" onClick={() => validateStep1() && setStep(2)} className={`w-full py-4 rounded-2xl text-white font-black shadow-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${theme.gradient} ${theme.hover} active:scale-95`}>
                      Next Step <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <InputField label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" icon={<Lock size={18}/>} theme={theme} rightIcon={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                    } />
                    
                    <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" icon={<Lock size={18}/>} theme={theme} />

                    {isStudent ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Level</label>
                        <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className={`w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all ${theme.border} focus:bg-white font-medium text-slate-700`}>
                          <option value="">Select Level</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                        </select>
                      </div>
                    ) : (
                      <InputField label="Teaching Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Computer Science" theme={theme} />
                    )}

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="p-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-all">
                        <ArrowLeft size={20}/>
                      </button>
                      <button type="submit" disabled={loading} className={`flex-1 py-4 rounded-2xl text-white font-black shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${theme.gradient} ${theme.hover} disabled:opacity-70 active:scale-95`}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account? <Link to="/login" className={`font-black underline decoration-2 underline-offset-4 text-${theme.primary}`}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon, rightIcon, error, theme, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">{icon}</div>}
      <input {...props} className={`w-full p-4 ${icon ? 'pl-12' : 'pl-5'} ${rightIcon ? 'pr-12' : 'pr-5'} bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium transition-all outline-none ${theme.border} focus:bg-white ${error ? 'border-red-500 bg-white' : ''}`} />
      {rightIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">{rightIcon}</div>}
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold ml-1">{error}</p>}
  </div>
);

const SuccessState = ({ theme, firstName }) => (
  <div className="text-center py-4">
    <div className={`w-24 h-24 bg-${theme.primary} text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-${theme.primary}/30`}>
      <CheckCircle2 size={48} />
    </div>
    <h2 className="text-3xl font-black text-slate-900">All set, {firstName}!</h2>
    <p className="text-slate-500 font-medium mt-2 px-4 text-sm leading-relaxed">
      Your account was created successfully. You can now access your personalized dashboard.
    </p>
    <Link to="/login" className={`mt-8 block w-full py-4 rounded-2xl text-white font-black shadow-lg bg-gradient-to-r ${theme.gradient} ${theme.hover} transition-all active:scale-95`}>
      Sign In Now
    </Link>
  </div>
);