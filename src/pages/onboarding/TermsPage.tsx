import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';

export default function TermsPage() {
  const navigate = useNavigate();
  const { data, updateData, nextStep } = useOnboarding();
  const [agreedToTerms, setAgreedToTerms] = useState(data?.agreedToTerms || false);
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(data?.agreedToPrivacyPolicy || false);

  const handleContinue = () => {
    updateData({ agreedToTerms, agreedToPrivacyPolicy });
    nextStep();
    navigate('/onboarding/signup');
  };

  const canContinue = agreedToTerms && agreedToPrivacyPolicy;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-2 bg-white/20">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: '16.67%',
              backgroundColor: COLORS.yellow 
            }}
          />
        </div>
        <div className="text-center py-2">
          <span className="text-white text-sm font-medium">Step 1 of 6</span>
        </div>
      </div>


      <div className="absolute top-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', left: '40px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '-10px', left: '80px' }}></div>
          <div className="absolute w-28 h-28 bg-white rounded-full" style={{ top: '20px', left: '100px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ bottom: '10px', right: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ bottom: '0px', right: '40px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ bottom: '20px', right: '80px' }}></div>
        </div>
      </div>

      <div className="max-w-2xl w-full z-10">
        <div className="flex flex-col items-center mb-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.yellow }}>
            Terms and Conditions
          </h1>
          
          {/* Separator */}
          <div className="w-full max-w-md h-0.5 bg-white"></div>
        </div>

        {/* Scrollable Terms Box */}
        <div className="bg-white rounded-2xl p-6 max-h-[50vh] overflow-y-auto mb-8 shadow-xl">
          <div className="space-y-6 text-sm md:text-base text-gray-800">
            <section>
              <h2 className="font-bold text-lg mb-2">A. Terms & Conditions</h2>
              <p className="text-sm text-gray-600 mb-3">Effective Date: March 30, 2025</p>
              <p className="mb-3">
                Welcome to Circl International Inc. ("Circl," "we," "us," or "our"). By accessing or using our platform, 
                you agree to abide by these Terms & Conditions. If you do not agree, please do not use our platform.
              </p>

              <h3 className="font-semibold mt-4 mb-2">1. Use of the Platform</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>You must be at least 18 years old to use Circl.</li>
                <li>You are responsible for all activity under your account.</li>
                <li>Misuse of the platform, including spamming, harassment, or unauthorized access, will result in suspension or termination.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">2. Intellectual Property</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Circl owns all platform content, trademarks, and proprietary materials.</li>
                <li>Users retain ownership of their content but grant Circl a license to use it for platform functionality.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">3. Modification of Terms</h3>
              <p>Circl reserves the right to update these Terms & Conditions at any time. Users will be notified of significant changes.</p>

              <h3 className="font-semibold mt-4 mb-2">4. Limitation of Liability</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Circl is not responsible for business outcomes, financial losses, or damages resulting from platform use.</li>
                <li>We provide the platform "as is" without warranties of any kind.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">5. Governing Law</h3>
              <p>These Terms & Conditions are governed by the laws of the State of Texas, USA.</p>

              <h3 className="font-semibold mt-4 mb-2">6. Termination</h3>
              <p>We reserve the right to terminate accounts violating these terms.</p>
            </section>

            <section className="pt-4 border-t border-gray-300">
              <h2 className="font-bold text-lg mb-2">B. Privacy Policy</h2>
              <p className="text-sm text-gray-600 mb-3">Effective Date: March 30, 2025</p>
              <p className="mb-3">
                Circl International Inc. values your privacy. This Privacy Policy explains how we collect, use, and protect your data.
              </p>

              <h3 className="font-semibold mt-4 mb-2">1. Information We Collect</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Personal data (e.g., name, email, business details).</li>
                <li>Usage data (e.g., interactions with the platform).</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">2. How We Use Your Data</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>To provide and improve our platform.</li>
                <li>To personalize user experience and offer relevant business connections.</li>
                <li>To send updates, promotions, and platform news.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">3. Data Sharing</h3>
              <p>We do not sell your data. We may share it with trusted partners to enhance platform functionality.</p>

              <h3 className="font-semibold mt-4 mb-2">4. Data Security</h3>
              <p>We implement industry-standard security measures to protect your information.</p>

              <h3 className="font-semibold mt-4 mb-2">5. Your Rights</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access, update, or delete your data.</li>
                <li>Opt-out of promotional communications.</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">6. Contact Us</h3>
              <p>For privacy concerns, contact us at <a href="mailto:privacy@circlapp.online" className="text-blue-600 underline">privacy@circlapp.online</a>.</p>
            </section>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4 mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-white accent-yellow-400"
            />
            <span className="text-white text-base md:text-lg">
              I agree to the <span className="font-bold">Terms & Conditions</span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToPrivacyPolicy}
              onChange={(e) => setAgreedToPrivacyPolicy(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-white accent-yellow-400"
            />
            <span className="text-white text-base md:text-lg">
              I agree to the <span className="font-bold">Privacy Policy</span>
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg transition-all ${
            canContinue 
              ? 'hover:scale-105' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ 
            backgroundColor: COLORS.yellow,
            color: COLORS.primary
          }}
        >
          Continue
        </button>

        {/* Back to Login */}
        <button
          onClick={() => navigate('/login')}
          className="w-full mt-4 py-3 text-white text-base underline hover:text-yellow-300 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
