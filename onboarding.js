
/**
 * onboarding.js - Management for dieHantar First Entry
 * Studio: Cendikiawan Studios
 * Author: Sultan Rama Kirana
 */

const Onboarding = {
    currentSlide: 0,
    totalSlides: 3,

    /**
     * Moves to the next slide or finishes onboarding.
     */
    next() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateUI();
        } else {
            this.finish();
        }
    },

    /**
     * Updates the UI to reflect the current slide.
     */
    updateUI() {
        const slider = document.getElementById('onboarding-slider');
        const dots = document.getElementById('slider-dots').children;
        
        // Move the slider
        slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update the dot indicators
        Array.from(dots).forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.className = "w-8 h-1 bg-orange-500 rounded-full transition-all duration-300";
            } else {
                dot.className = "w-2 h-1 bg-zinc-800 rounded-full transition-all duration-300";
            }
        });
    },

    /**
     * Finishes onboarding and redirects to the login page.
     */
    finish() {
        // Mark that the user has seen the onboarding to prevent it from showing again.
        localStorage.setItem('diehantar_onboarding_completed', 'true');
        
        // Animate out and redirect
        document.getElementById('onboarding-screen').style.opacity = 0;
        document.getElementById('onboarding-screen').style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    },

    /**
     * Allows the user to skip the onboarding process.
     */
    skip() {
        this.finish();
    }
};

// Initial check: if user has already seen onboarding, redirect them immediately.
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('diehantar_onboarding_completed') === 'true') {
        window.location.replace('login.html');
    }
});
