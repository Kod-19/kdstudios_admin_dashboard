export default function ServicesOverview() {
  const services = [
    {
      title: 'Business Websites',
      description: 'High-converting, responsive landing pages and company websites built with high speed, clear messaging, and smooth interactions.',
      tag: 'Web Development',
      icon: (
        <svg className="w-6 h-6 text-(--primary-color)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: 'E-Commerce Stores',
      description: 'Custom storefronts equipped with Paystack payment processing, mobile money support, product catalogs, and conversion-focused checkout flows.',
      tag: 'Payments & Shop',
      icon: (
        <svg className="w-6 h-6 text-(--primary-color)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Custom Web Apps',
      description: 'Tailored client dashboards, SaaS tools, and dynamic applications engineered with React, Node.js, Express, and database integrations.',
      tag: 'Full-Stack',
      icon: (
        <svg className="w-6 h-6 text-(--primary-color)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Mobile Apps',
      description: 'Cross-platform iOS and Android mobile apps crafted with React Native, delivering fast performance and intuitive mobile UI experiences.',
      tag: 'React Native',
      icon: (
        <svg className="w-6 h-6 text-(--primary-color)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="py-20 bg-(--dark-bg) relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-(--primary-color)">
            What We Do
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-(--title-color)">
            Tailored Digital Solutions for Modern Brands
          </h3>
          <p className="text-(--text-color) text-base sm:text-lg">
            From high-performing business websites to full-stack web applications and React Native mobile apps.
          </p>
        </div>

        {/* Services Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="interactive-card p-6 rounded-2xl bg-(--card-bg) border border-(--card-border) flex flex-col justify-between group hover:border-(--primary-color)/50 transition-all"
            >
              <div className="space-y-4">
                {/* Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-(--surface-bg) border border-(--card-border) group-hover:border-(--primary-color)/30 transition-colors">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-(--surface-bg) text-(--text-color) border border-(--card-border)">
                    {service.tag}
                  </span>
                </div>

                {/* Service Title & Desc */}
                <h4 className="text-xl font-bold text-(--title-color) group-hover:text-(--primary-color) transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm text-(--text-color) leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Bottom CTA Link */}
              <div className="pt-6 mt-6 border-t border-(--card-border)/50 flex items-center justify-between text-xs font-semibold text-(--title-color)">
                <span>Explore Option</span>
                <span className="text-(--primary-color) group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}