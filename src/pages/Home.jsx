import React, { useEffect, useRef, useState } from 'react';
import './Home.css';

const HomePage = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const fadeInRefs = useRef([]);
  const [stats, setStats] = useState([
    { value: '10,000+', label: 'Happy Businesses' },
    { value: '₹100Cr+', label: 'GST Filed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ]);

  useEffect(() => {
    fetch("https://temp-gst.onrender.com/api/home-stats/")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStats(data.stats);
        }
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  useEffect(() => {
    // Smooth scrolling
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('home-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    fadeInRefs.current.forEach(el => el && observer.observe(el));

    // Header scroll background
    const handleScroll = () => {
      const header = document.querySelector('.home-header');
      header.style.background = window.scrollY > 100
        ? 'rgba(255, 255, 255, 0.98)'
        : 'rgba(255, 255, 255, 0.95)';
    };
    window.addEventListener('scroll', handleScroll);

    // Animate stats when in view
    const animateCounters = () => {
      const counters = document.querySelectorAll('.home-stat-item h3');
      counters.forEach(counter => {
        const targetText = counter.textContent;
        const isPercentage = targetText.includes('%');
        const isCurrency = targetText.includes('₹');
        const isTime = targetText.includes('/');

        let finalNumber = parseInt(targetText.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = finalNumber / 50;

        const updateCounter = () => {
          if (current < finalNumber) {
            current += increment;
            if (isPercentage) counter.textContent = `${Math.floor(current)}%`;
            else if (isCurrency) counter.textContent = `₹${Math.floor(current)}Cr+`;
            else if (isTime) counter.textContent = '24/7';
            else counter.textContent = `${Math.floor(current).toLocaleString()}+`;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = targetText;
          }
        };
        updateCounter();
      });
    };

    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, [stats]);

  const addToRefs = (el) => {
    if (el && !fadeInRefs.current.includes(el)) {
      fadeInRefs.current.push(el);
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/signup';
  };

  const featureCards = [
    { icon: '📊', title: 'Easy GST Returns', description: 'File GSTR-1, GSTR-3B, and annual returns with a few clicks.' },
    { icon: '💰', title: 'Tax Calculation', description: 'Automatic GST calculation for all transactions.' },
    { icon: '📈', title: 'Real-time Analytics', description: 'Insights into business performance with visual dashboards.' },
    { icon: '🔒', title: 'Secure & Compliant', description: 'Bank-grade encryption ensures complete data security.' },
    { icon: '📱', title: 'Mobile Friendly', description: 'Access your GST dashboard anywhere, anytime.' },
    { icon: '🎯', title: 'Expert Support', description: 'Team of CA and GST experts available round the clock.' }
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <nav className="home-container">
          <div className="home-logo">GSTEase</div>
          <ul className="home-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><button onClick={handleLoginClick} className="home-cta-btn">Login</button></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="home-hero" ref={heroRef}>
          <div className="home-container">
            <h1>Simplify Your GST Management</h1>
            <p>Streamline your GST compliance, filing, and reporting with our comprehensive platform.</p>
            <div className="home-hero-buttons">
              <button onClick={handleLoginClick} className="home-cta-btn home-secondary-btn">Get Started</button>
              <a href="#features" className="home-cta-btn home-secondary-btn">Learn More</a>
            </div>
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-container">
            <h2 className="home-fade-in" ref={addToRefs}>Why Choose GSTEase?</h2>
            <div className="home-features-grid">
              {featureCards.map((feature, index) => (
                <div key={index} className="home-feature-card home-fade-in" ref={addToRefs}>
                  <div className="home-feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-stats" ref={statsRef}>
          <div className="home-container">
            <div className="home-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="home-stat-item home-fade-in" ref={addToRefs}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer" id="contact">
        <div className="home-container">
          <div className="home-footer-content">
            <div className="home-footer-section">
              <h3>GSTEase</h3>
              <p>Making GST compliance simple and efficient for Indian businesses of all sizes.</p>
            </div>
            <div className="home-footer-section">
              <h3>Quick Links</h3>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
              <a href="/pricing">Pricing</a>
              <a href="/support">Support</a>
            </div>
            <div className="home-footer-section">
              <h3>Resources</h3>
              <a href="/help">Help Center</a>
              <a href="/blog">Blog</a>
              <a href="/api-docs">API Documentation</a>
              <a href="/templates">GST Templates</a>
            </div>
            <div className="home-footer-section">
              <h3>Contact</h3>
              <a href="mailto:support@gstease.com">support@gstease.com</a>
              <a href="tel:+911234567890">+91 12345 67890</a>
              <p>Mon–Fri 9AM–6PM IST</p>
            </div>
          </div>
          <div className="home-footer-bottom">
            <p>&copy; 2025 GSTEase. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
