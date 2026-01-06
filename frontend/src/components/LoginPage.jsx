import React, { useState } from "react";
import { useBehaviorTracking } from "../hooks/useBehaviorTracking";
import { FaFingerprint, FaUser } from "react-icons/fa";
import VerdictPopup from "./VerdictPopup";

const LoginPage = ({ onNavigate }) => {
  const [name, setName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [honeyPot, setHoneyPot] = useState(""); // The existing Honeypot state
  
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const { getPayload } = useBehaviorTracking();

  const handleAadhaarChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const truncated = rawValue.slice(0, 12);
    const formatted = truncated.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhar(formatted);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. HONEYPOT CHECK (Existing)
    if (honeyPot.length > 0) {
        console.warn("🍯 HONEYPOT TRIGGERED! Bot caught.");
        setTimeout(() => {
            setVerdict({
                is_bot: true, confidence_score: 100.0,
                features_calculated: { efficiency: 1.0, curvature: 0.0, note: "Honeypot Triggered" }
            });
            setIsLoading(false);
        }, 500);
        return;
    }

    // --- 2. NEW: GHOST WINDOW CHECK (Screen Resolution) ---
    // Rule: Headless bots often have 0 width/height OR use default 800x600 which might mismatch the screen.
    // We check if the outer window is 0 (impossible for humans)
    const isHeadless = window.outerWidth === 0 || window.outerHeight === 0;
    
    if (isHeadless) {
        console.warn("👻 GHOST WINDOW DETECTED! Zero dimensions.");
        setTimeout(() => {
            setVerdict({
                is_bot: true,
                confidence_score: 100.0,
                features_calculated: { 
                    efficiency: 1.0, curvature: 0.0, 
                    note: "Headless Browser (Ghost Window)" 
                }
            });
            setIsLoading(false);
        }, 500);
        return; 
    }

    // --- 3. NEW: VAMPIRE CHECK (Tab Visibility) ---
    // Rule: Humans cannot click 'Login' if they cannot see the page.
    // If the document is 'hidden' at the moment of submission, it's a script running in background.
    if (document.visibilityState === 'hidden') {
        console.warn("🧛 VAMPIRE CHECK DETECTED! Input from hidden tab.");
        setTimeout(() => {
            setVerdict({
                is_bot: true,
                confidence_score: 100.0,
                features_calculated: { 
                    efficiency: 1.0, curvature: 0.0, 
                    note: "Background Script (Vampire)" 
                }
            });
            setIsLoading(false);
        }, 500);
        return;
    }

    // 4. PROCEED TO MODEL (Only if they passed Honeypot, Ghost, and Vampire)
    const payload = getPayload();

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setVerdict(data);
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Error: Ensure app.py is running!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-grey-97 font-sans text-gray-800">
      <main className="flex-grow flex items-start justify-center p-6 pt-24 md:pt-32">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="bg-brand-green h-2 w-full"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to myAadhaar</h2>
              <p className="text-gray-500 text-sm">Login with Name and Aadhaar to access services</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* HONEYPOT FIELD (The Bait) */}
              <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden">
                <label htmlFor="middle_name">Middle Name (Optional)</label>
                <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    value={honeyPot}
                    onChange={(e) => setHoneyPot(e.target.value)}
                    autoComplete="off"
                    tabIndex="-1" 
                    placeholder="Enter Middle Name"
                />
              </div>

              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Enter Name as per Aadhaar"
                  />
                </div>
              </div>

              {/* Aadhaar Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Aadhaar Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFingerprint className="text-brand-green text-lg" />
                  </div>
                  <input
                    type="text"
                    value={aadhar}
                    onChange={handleAadhaarChange}
                    maxLength="14"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all bg-gray-50 focus:bg-white tracking-widest font-mono text-lg"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 cursor-pointer
                            ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-brand-green hover:bg-brand-dark hover:-translate-y-1 hover:shadow-xl active:scale-95"
                            }
                `}
              >
                {isLoading ? "Verifying Biometrics..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-brand-green font-semibold hover:underline">Forgot Aadhaar Number?</a>
            </div>
          </div>
        </div>
      </main>

      {/* Verdict Popup */}
      {verdict && (
        <VerdictPopup 
            result={verdict} 
            onRedirect={(dest) => {
            if (dest === 'HOME') onNavigate('home', name);
            if (dest === 'CAPTCHA') onNavigate('captcha');
            }} 
        />
      )}
    </div>
  );
};

export default LoginPage;