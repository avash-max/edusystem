import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';
import { createUserApi } from '../../services/api';

export default function Register() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('individual'); // Matches backend ENUM: individual/organization
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '',
    subject: '',
    school: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Minimum 8 characters';
    
    if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (userType === 'individual' && !formData.gradeLevel) errs.gradeLevel = 'Select a grade';
    if (userType === 'organization' && !formData.subject.trim()) errs.subject = 'Subject is required';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    
    // Preparing data for Backend
    const payload = {
      username: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: userType,
      // We bundle extra details into the "info" field the backend expects
      info: JSON.stringify({
        gradeLevel: formData.gradeLevel,
        subject: formData.subject,
        school: formData.school,
        fullName: `${formData.firstName} ${formData.lastName}`
      })
    };

    try {
      const response = await createUserApi(payload);
      
      if (response.data.success) {
        setStep(3);
      } else {
        setErrors({ server: response.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ server: error.response?.data?.message || "An error occurred during registration" });
    } finally {
      setLoading(false);
    }
  };

  // UI Helpers
  const isStudent = userType === 'individual';
  const themeColor = isStudent ? 'blue' : 'orange';
  const gradientBtn = isStudent
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-600/20'
    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-600/20';
  const focusBorder = isStudent ? 'focus:border-blue-500' : 'focus:border-orange-500';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {step < 3 && (
          <div className="flex justify-center mb-8 space-x-4">
            {[1, 2].map((i) => (
              <div key={i} className={`h-2 w-12 rounded-full transition-colors duration-500 ${step >= i ? (isStudent ? 'bg-blue-600' : 'bg-orange-600') : 'bg-slate-200'}`} />
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
          {step === 3 ? (
            <SuccessState firstName={formData.firstName} gradientBtn={gradientBtn} />
          ) : (
            <div className="space-y-6">
              <header className="text-center">
                <h1 className="text-2xl font-black text-slate-800">Create Account</h1>
                <p className="text-slate-500 text-sm">Step {step} of 2: {step === 1 ? 'Personal Details' : 'Security'}</p>
              </header>

              {errors.server && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
                  {errors.server}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setUserType('individual')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${isStudent ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                      <GraduationCap size={16} /> Student
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUserType('organization')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!isStudent ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}
                    >
                      <BookOpen size={16} /> Teacher
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Jane" icon={<User size={16}/>} focusBorder={focusBorder} />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" focusBorder={focusBorder} />
                  </div>

                  <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="jane@example.com" icon={<Mail size={16}/>} focusBorder={focusBorder} />

                  <button onClick={handleNext} className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all ${gradientBtn}`}>
                    Continue to Security
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <InputField 
                      label="Password" 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      value={formData.password} 
                      onChange={handleChange} 
                      error={errors.password} 
                      placeholder="•••••••" 
                      icon={<Lock size={16}/>} 
                      focusBorder={focusBorder} 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-slate-400">
                      {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>

                  <div className="relative">
                    <InputField 
                      label="Confirm Password" 
                      name="confirmPassword" 
                      type={showConfirm ? 'text' : 'password'} 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      error={errors.confirmPassword} 
                      placeholder="••••••••" 
                      icon={<Lock size={16}/>} 
                      focusBorder={focusBorder} 
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-10 text-slate-400">
                      {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>

                  {isStudent ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Grade Level</label>
                      <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className={`w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none ${focusBorder}`}>
                        <option value="">Select Grade</option>
                        <option value="highschool">High School</option>
                        <option value="university">University</option>
                      </select>
                      {errors.gradeLevel && <p className="text-red-500 text-[10px] font-bold">{errors.gradeLevel}</p>}
                    </div>
                  ) : (
                    <InputField label="Subject" name="subject" value={formData.subject} onChange={handleChange} error={errors.subject} placeholder="e.g. Physics" focusBorder={focusBorder} />
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Back</button>
                    <button type="submit" disabled={loading} className={`flex-1 py-4 rounded-xl text-white font-bold shadow-lg transition-all ${gradientBtn} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {loading ? 'Creating...' : 'Finish Signup'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon, error, focusBorder, ...props }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input 
        {...props} 
        className={`w-full p-3 ${icon ? 'pl-10' : 'pl-4'} bg-slate-50 border-2 border-slate-100 rounded-xl text-sm transition-all outline-none ${focusBorder} ${error ? 'border-red-200 bg-red-50' : ''}`}
      />
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
  </div>
);

const SuccessState = ({ firstName, gradientBtn }) => (
  <div className="text-center space-y-4 py-6">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-800">Welcome aboard, {firstName}!</h2>
    <p className="text-slate-500 text-sm">Your account has been created. Start your learning journey today.</p>
    <Link to="/login" className={`block w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all ${gradientBtn}`}>
      Go to Login
    </Link>
  </div>
);