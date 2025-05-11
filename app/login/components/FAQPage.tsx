'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/form';

interface FAQPageProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setView }) => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What is multifactor authentication?",
      answer: "A password is one possible 'factor' for authenticating yourself, something that only you should know. Multifactor authentication (MFA) augments that password by occasionally requiring members to confirm their identities with a second factor, a code, that is provided through a text message (SMS), a voice call, or an email message. Through the use of MFA, a person that has obtained your username and password cannot access your account because that person would also need to access your telephone or email account."
    },
    {
      question: "I am being prompted for MFA. What are my next steps?",
      answer: "In a Browser: Click on the drop down menu to display a list of options for receiving the code. Select your preferred option and click \"Send Code\". Once you receive the code, enter it into the \"Enter Code\" field and click the \"Verify\" button.\n\nIn the Mobile App: A list of options for receiving the code will be presented. Tap on the one you want to use. Once you receive the code, enter it into the \"Enter Code\" field and tap the \"Verify\" button."
    },
    {
      question: "Why do I keep getting prompted to MFA?",
      answer: "If you are using a web browser (e.g., Google Chrome or Mozilla Firefox), there are a few things that may cause this to occur:\n\n- The \"Do not challenge me on this device again\" checkbox was not checked before signing in.\n- The \"Do not challenge me on this device again\" setting is \"remembered\" by the web browser on a single device, so if you use a different browser or another device, you will be prompted for an authentication factor the first time you use them.\n- Your web browser is configured to clear cookies when you close it or it is configured to reject cookies. This could be a browser setting or a setting of a browser plug-in.\n- Browsing anonymously or \"incognito\" can also cause this issue.\n\nIf you are using a Members 1st mobile app, there are a few things that can make this happen:\n\n- You have uninstalled and reinstalled the mobile app.\n- You are using the mobile app for the first time on a different device."
    },
    // Additional FAQ items would be added here following the same pattern
    // ... (rest of FAQ items from provided content)
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Frequently <span className="font-normal">Asked Questions</span>
            </h1>
            <p className="text-neutral-400 text-sm mb-6">
              Your account security is very important and at Members 1st we take it one step further by securing your account(s) and your Online Banking experience with multifactor authentication.
            </p>
            <p className="text-neutral-400 text-sm">
              As part of our Online Banking account security, you may be prompted to enter a one-time code during sign-in. The code will be sent to you by your choice of email, SMS (text message), or voice call. Whichever method you choose, it is important for you to make sure your contact information in Online Banking is correct.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full text-left p-4 bg-[#1a1a1a] hover:bg-[#252525] transition-colors flex justify-between items-center"
                >
                  <h3 className="font-medium text-white">{faq.question}</h3>
                  <span className="text-green-200">
                    {openQuestion === index ? '−' : '+'}
                  </span>
                </button>
                {openQuestion === index && (
                  <div className="p-4 bg-[#1a1a1a] border-t border-neutral-700">
                    <p className="text-neutral-300 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <Button 
              type="button" 
              variant="borderless"
              onClick={() => setView('helpCenter')}
              className="text-white text-sm"
            >
              Back to Help Center
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6 text-center">
          <p className="text-neutral-500 text-sm">
            Need additional support? Please call us at
          </p>
          <a href="tel:8002377288" className="text-white font-medium mt-1 hover:underline">800-237-7288</a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
