
import React, { useState } from "react";

import HERO_IMG from "../assets/hero-img.jpg";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    const [openAuthModal, setOPenAuthModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleCTA = () => {};

    return (
        <div className="w-full min-h-full bg-[#FFFCEF]">
            <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

            <header>
                <div>Interview Prep AI</div>

                <button onClick={() => setOPenAuthModal(true)}>
                    Login/Sign Up
                </button>
            </header>

            <div>
                <div>
                    <div>
                        <div>
                            AI Powered
                        </div>
                    </div>

                    <h1>
                        Ace Interviews with <br />
                        <span>AI-Powered</span>
                        Learning
                    </h1>
                </div>

                <div>
                    <p>
                        Get role-specific questions, expand answers when you
                        need them, dive deeper into concepts, and organize
                        everything your way.
                    </p>

                    <button onClick={handleCTA}>
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;