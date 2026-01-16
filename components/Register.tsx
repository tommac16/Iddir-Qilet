import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockDb, compressImage } from '../services/mockDb';
import { UserRole, TransactionStatus } from '../types';
import { ArrowLeft, Loader2, ShieldCheck, Mail, RefreshCw, Smartphone, CheckCircle, Upload, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import RegistrationForm, { RegistrationFormData } from './RegistrationForm';
import { useLanguage } from '../contexts/LanguageContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<'REGISTER' | 'VERIFY' | 'PAYMENT' | 'SUCCESS'>('REGISTER');
  const [loading, setLoading] = useState(false);
  // We hold the valid form data here to use it after verification
  const [pendingData, setPendingData] = useState<RegistrationFormData | null>(null);
  
  const [verificationCode, setVerificationCode] = useState('');
  const [serverCode, setServerCode] = useState(''); // Store the actual OTP
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleRegisterSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setPendingData(data);

    // Simulate sending code delay
    setTimeout(() => {
        const code = generateOTP();
        setServerCode(code);
        setLoading(false);
        setStep('VERIFY');
        setResendTimer(30);
    }, 1000);
  };

  const handleResendCode = () => {
      setResendTimer(30);
      setError('');
      setVerificationCode(''); // Clear input for the new code
      setLoading(true);
      // Simulate resend API call
      setTimeout(() => {
          const code = generateOTP();
          setServerCode(code);
          setLoading(false);
      }, 1000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode.length !== 6 || isNaN(Number(verificationCode))) {
        setError("Please enter a valid 6-digit numeric code.");
        return;
    }

    if (!pendingData) {
        setError("Session expired. Please start over.");
        setStep('REGISTER');
        return;
    }

    setLoading(true);

    // Simulate verification
    setTimeout(() => {
        if (verificationCode !== serverCode) {
            setError("Invalid verification code. Please check the code sent to your device.");
            setLoading(false);
            return;
        }
        
        // Verification Successful -> Move to Payment
        setLoading(false);
        setStep('PAYMENT');
    }, 1000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const compressed = await compressImage(e.target.files[0]);
            setReceiptImage(compressed);
            setError('');
        } catch (err) {
            setError("Image processing failed. Try a smaller file.");
        }
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!receiptImage) {
          setError("Please upload a receipt image.");
          return;
      }
      if (!pendingData) {
          setError("Session expired.");
          setStep('REGISTER');
          return;
      }

      setLoading(true);

      setTimeout(() => {
          // 1. Create Member (PENDING)
          const newMember = {
                id: `m${Date.now()}`,
                fullName: pendingData.fullName,
                email: pendingData.email,
                phone: pendingData.phone,
                role: UserRole.MEMBER,
                status: 'PENDING' as const,
                joinDate: new Date().toISOString().split('T')[0],
                balance: 0,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingData.fullName)}&background=a08679&color=fff`,
                gender: pendingData.gender,
                password: pendingData.password
          };
          mockDb.addMember(newMember);

          // 2. Create Pending Transaction linked to member
          mockDb.addTransaction({
              id: `tx${Date.now()}`,
              memberId: newMember.id,
              memberName: newMember.fullName,
              date: new Date().toISOString().split('T')[0],
              amount: 2200,
              type: 'CONTRIBUTION',
              description: 'Initial Registration Fee',
              status: TransactionStatus.PENDING,
              receiptUrl: receiptImage
          });

          setLoading(false);
          setStep('SUCCESS');
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-brand-900">
           <ShieldCheck className="w-12 h-12 text-accent-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-brand-900">
          {step === 'REGISTER' ? t('register.title') : 
           step === 'VERIFY' ? t('register.verify_title') : 
           step === 'PAYMENT' ? t('register.payment_title') : 'Registration Submitted'}
        </h2>
        <p className="mt-2 text-center text-sm text-brand-600">
          {step === 'REGISTER' ? t('register.subtitle') : 
           step === 'VERIFY' ? t('register.verify_subtitle') :
           step === 'PAYMENT' ? t('register.payment_desc') : ''}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-brand-100">
          
          {step === 'REGISTER' && (
            <RegistrationForm onSubmit={handleRegisterSubmit} isLoading={loading} />
          )}

          {step === 'VERIFY' && (
            <form className="space-y-6" onSubmit={handleVerifySubmit}>
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col gap-2 border border-blue-100">
                     <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            {t('register.code_sent')} <strong>{pendingData?.email}</strong>
                        </p>
                     </div>
                     <div className="flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            {t('register.code_sent')} <strong>{pendingData?.phone}</strong>
                        </p>
                     </div>
                     <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs text-blue-600 font-medium">
                            {t('register.demo_otp')}: <span className="font-mono text-lg font-bold tracking-wider text-blue-800">{serverCode}</span>
                        </p>
                     </div>
                </div>

                <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-brand-700">
                        {t('register.verification_code')}
                    </label>
                    <div className="mt-1">
                        <input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        maxLength={6}
                        placeholder={t('register.enter_code')}
                        required
                        value={verificationCode}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                                setVerificationCode(val);
                                setError('');
                            }
                        }}
                        className="appearance-none block w-full px-3 py-3 border border-brand-300 rounded-md shadow-sm placeholder-brand-300 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('register.verify_btn')}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendTimer > 0 || loading}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-brand-300 rounded-md shadow-sm text-sm font-medium text-brand-700 bg-white hover:bg-brand-50 disabled:opacity-50 disabled:bg-gray-50 transition-all"
                        >
                            <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                            {resendTimer > 0 ? `${t('register.resend')} (${resendTimer}s)` : t('register.resend')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('REGISTER')}
                            className="w-full flex justify-center py-2 px-4 border border-brand-300 rounded-md shadow-sm text-sm font-medium text-brand-700 bg-white hover:bg-brand-50"
                        >
                            {t('register.change_info')}
                        </button>
                    </div>
                </div>
            </form>
          )}

          {step === 'PAYMENT' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 space-y-2">
                      <h4 className="font-bold text-green-800 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" /> 2,200 ETB
                      </h4>
                      <p className="text-sm text-green-700">Please transfer the fee to the bank account below:</p>
                      <div className="bg-white p-3 rounded border border-green-200 text-sm font-mono text-gray-700">
                          <p>Bank: CBE (Commercial Bank of Ethiopia)</p>
                          <p>Account: 100023456789</p>
                          <p>Name: Mahber Iddir St.Merry Qilet</p>
                      </div>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">{t('register.upload_receipt')}</label>
                    <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-brand-200 border-dashed rounded-lg hover:bg-brand-50 transition ${receiptImage ? 'bg-green-50 border-green-200' : ''}`}>
                        <div className="space-y-1 text-center">
                            {receiptImage ? (
                                <div className="relative group">
                                    <img src={receiptImage} alt="Receipt Preview" className="mx-auto h-32 object-contain rounded-md" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-md">
                                        <button 
                                            type="button" 
                                            onClick={() => setReceiptImage(null)}
                                            className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="mx-auto h-12 w-12 text-brand-300" />
                                    <div className="flex text-sm text-brand-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent-600 hover:text-accent-500 focus-within:outline-none">
                                            <span>Upload Receipt</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-brand-400">JPG, PNG up to 2MB</p>
                                </>
                            )}
                        </div>
                    </div>
                  </div>

                  <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('register.complete')}
                    </button>
              </form>
          )}

          {step === 'SUCCESS' && (
              <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-900 mb-2">Registration Submitted</h3>
                  <p className="text-brand-600 mb-8 max-w-xs mx-auto">
                      Your account and payment of <strong>2,200 ETB</strong> are currently <strong>PENDING</strong> approval.
                  </p>
                  <Link 
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-900 hover:bg-brand-800 shadow-sm"
                  >
                      Return to Login
                  </Link>
              </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-brand-500">
                  {t('register.already_member')}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
                <Link to="/login" className="text-accent-600 font-medium hover:text-accent-500">
                    {t('register.signin')}
                </Link>
            </div>
            
            <div className="mt-4 text-center">
                <Link to="/" className="text-brand-400 text-xs hover:text-brand-600 flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> {t('common.back_home')}
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;