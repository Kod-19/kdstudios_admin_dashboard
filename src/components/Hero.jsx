import profilePic from '../assets/profile_pic_optimized.jpg';

export default function Hero() {
  const serviceChips = ['Websites', 'E-Commerce', 'Web Apps', 'Mobile Apps'];

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 lg:py-20 overflow-hidden">
      {/* Radial Background Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-(--tertiary-color)/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 animate-fade-up">
            
            {/* Brand Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--surface-bg) border border-(--card-border)">
              <span className="w-2 h-2 rounded-full bg-(--primary-color) animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--primary-color)">
                KD Studios
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-(--title-color) leading-tight tracking-tight">
              Building Digital Experiences That <span className="text-transparent bg-clip-text bg-linear-to-r from-(--primary-color) to-blue-400">Scale Your Business</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-(--text-color) max-w-2xl leading-relaxed">
              We design and build high-converting websites, e-commerce stores, custom web applications, and cross-platform mobile apps with React Native.
            </p>

            {/* Service Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {serviceChips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-(--card-bg) border border-(--card-border) text-(--title-color)"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Calls To Action */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/project-brief"
                className="button-pop px-6 py-3.5 text-sm font-semibold text-(--dark-bg) bg-(--primary-color) rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
              >
                Start a Project
              </a>
              <a
                href="#pricing"
                className="button-pop px-6 py-3.5 text-sm font-semibold text-(--title-color) bg-(--surface-bg) border border-(--card-border) rounded-xl hover:border-(--primary-color) transition-all"
              >
                View Pricing
              </a>
              <a
                href="/payments"
                className="hidden sm:inline-flex button-pop px-6 py-3.5 text-sm font-semibold text-(--text-color) hover:text-(--title-color) transition-colors"
              >
                Make Payment &rarr;
              </a>
            </div>

            {/* Proof Point Cards */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-(--card-border)/50">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-(--title-color)">100%</p>
                <p className="text-xs text-(--text-color)">Responsive Builds</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-(--title-color)">Paystack</p>
                <p className="text-xs text-(--text-color)">Payment-Ready</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-(--title-color)">Mobile</p>
                <p className="text-xs text-(--text-color)">React Native Apps</p>
              </div>
            </div>

          </div>

          {/* Right Column - Founder / Brand Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md animate-float-soft">
              
              {/* Outer Glowing Border */}
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-(--primary-color) to-blue-600 opacity-30 blur-lg" />
              
              <div className="relative interactive-card p-6 rounded-2xl bg-(--card-bg) space-y-6">
                
                {/* Visual Header / Avatar */}
                <div className="flex items-center gap-4">
                  <img
                    src={profilePic}
                    alt="Kwame Dawson - Founder"
                    className="w-16 h-16 rounded-full object-cover border-2 border-(--primary-color)"
                  />
                  <div>
                    <h3 className="font-bold text-(--title-color) text-lg">Kwame Dawson</h3>
                    <p className="text-xs text-(--primary-color) font-medium">Founder & Lead Developer</p>
                  </div>
                </div>

                {/* Current Focus Panel */}
                <div className="p-4 rounded-xl bg-(--surface-bg) border border-(--card-border) space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-(--title-color)">Current Focus</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--primary-color)/10 text-(--primary-color) font-bold">Active</span>
                  </div>
                  <p className="text-xs text-(--text-color) leading-relaxed">
                    Expanding KD Studios' service capabilities into custom React Native mobile applications alongside web platforms[cite: 1].
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}