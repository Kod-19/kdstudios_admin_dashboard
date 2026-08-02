import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    setIsMobileMenuOpen(false);
    
    // If it's a hash link and we're on the homepage, perform custom scroll offset
    if (href.startsWith('#') && window.location.pathname === '/') {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const offset = 80; // height of sticky header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-(--dark-bg)/80 border-b border-(--card-border) transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-(--tertiary-color) flex items-center justify-center font-bold text-white border border-(--primary-color)/30 group-hover:border-(--primary-color) transition-all">
              KD
            </div>
            <span className="font-bold text-lg tracking-wider text-(--title-color) group-hover:text-(--primary-color) transition-colors">
              KD STUDIOS
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-(--text-color) hover:text-(--primary-color) transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/project-brief"
              className="button-pop px-4 py-2 text-sm font-semibold text-(--dark-bg) bg-(--primary-color) rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              Start Project
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-(--text-color) hover:text-(--title-color) hover:bg-(--surface-bg) focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-(--card-border) bg-(--surface-bg) px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2 rounded-md text-base font-medium text-(--text-color) hover:text-(--primary-color) hover:bg-(--card-bg) transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="/project-brief"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-(--dark-bg) bg-(--primary-color) rounded-lg"
            >
              Start Project
            </a>
            <a
              href="/payments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-sm font-medium text-(--title-color) border border-(--card-border) rounded-lg hover:border-(--primary-color)"
            >
              Make Payment
            </a>
          </div>
        </div>
      )}
    </header>
  );
}