import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';

interface DuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  circleName: string;
  userId: number;
  isModerator: boolean;
}

export default function DuesModal({ 
  isOpen, 
  onClose, 
  circleId: _circleId, 
  circleName, 
  userId: _userId,
  isModerator
}: DuesModalProps) {
  const [duesAmount, setDuesAmount] = useState<number | null>(null);
  const [newDuesAmount, setNewDuesAmount] = useState('');
  const [hasStripeAccount, setHasStripeAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDuesInfo();
    }
  }, [isOpen]);

  const fetchDuesInfo = () => {
    setIsLoading(true);
    // Mock data
    setTimeout(() => {
      setDuesAmount(7500); // $75.00 in cents
      setHasStripeAccount(true);
      setIsLoading(false);
    }, 500);
  };

  const updateDues = () => {
    const amount = parseFloat(newDuesAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    console.log('Updating dues to:', amount);
    // TODO: Implement API call
    setDuesAmount(Math.round(amount * 100));
    setNewDuesAmount('');
    alert('Dues updated successfully!');
  };

  const setupStripe = () => {
    console.log('Setting up Stripe account');
    // TODO: Implement Stripe onboarding
    alert('Stripe setup would open here');
  };

  const startCheckout = () => {
    console.log('Starting checkout');
    // TODO: Implement Stripe checkout
    alert('Checkout would open here');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Circle Dues</h2>
            <p className="text-sm text-white/80">{circleName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-12 w-12 mb-4" style={{ color: COLORS.primary }} viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-lg font-semibold" style={{ color: COLORS.primary }}>Loading dues information...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {duesAmount !== null ? (
                <>
                  {/* Current Dues Display */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <p className="text-sm font-medium text-gray-500 mb-2">Current Dues</p>
                    <p className="text-5xl font-bold" style={{ color: COLORS.primary }}>
                      ${(duesAmount / 100).toFixed(2)}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Per member</p>
                    </div>
                  </div>

                  {isModerator ? (
                    /* Moderator Actions */
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Moderator Actions</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Dues Amount
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={newDuesAmount}
                                onChange={(e) => setNewDuesAmount(e.target.value)}
                                placeholder="75.00"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                                style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                              />
                            </div>
                            <button
                              onClick={updateDues}
                              className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                              style={{ backgroundColor: COLORS.primary }}
                            >
                              Update
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={setupStripe}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl font-semibold transition-colors hover:bg-gray-50"
                          style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {hasStripeAccount ? 'Edit Stripe Info' : 'Set Up Stripe'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Member Payment */
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Payment Required</h3>
                          <p className="text-sm text-gray-600">Complete your circle dues payment</p>
                        </div>
                      </div>

                      <button
                        onClick={startCheckout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pay Now
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* No Dues Set */
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Dues Not Set</h3>
                  <p className="text-gray-600 mb-6">Circle dues haven't been configured yet</p>

                  {isModerator && (
                    <div className="space-y-4">
                      {hasStripeAccount ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Set Dues Amount
                            </label>
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <input
                                  type="number"
                                  value={newDuesAmount}
                                  onChange={(e) => setNewDuesAmount(e.target.value)}
                                  placeholder="75.00"
                                  step="0.01"
                                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                                />
                              </div>
                              <button
                                onClick={updateDues}
                                className="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                style={{ backgroundColor: COLORS.primary }}
                              >
                                Set
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={setupStripe}
                            className="w-full px-4 py-3 border-2 rounded-xl font-semibold transition-colors hover:bg-gray-50"
                            style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                          >
                            Edit Stripe Info
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={setupStripe}
                          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          Set Up Stripe
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}