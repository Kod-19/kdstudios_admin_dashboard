import beckerysImg from '../assets/demo2.png';
import fitforgeImg from '../assets/fitforge.png';
import demo3Img from '../assets/demo3.png';
import demo4Img from '../assets/demo4.png';

export const featuredProjects = [
  {
    id: 'beckerys',
    title: "Beckery's",
    desc: 'Mobile-first storefront built for a local baking business to display products, accept orders, and communicate seamlessly via WhatsApp.',
    img: beckerysImg,
    demoLink: 'https://beckerys.vercel.app',
    tags: ['React', 'Tailwind CSS', 'Vercel', 'Client'],
    status: 'Live Project',
    caseStudy: `
      Challenge: The client needed a light, fast mobile storefront for customers to browse baked goods without full e-commerce overhead.
      Approach: Built a clean responsive interface styled with Tailwind CSS, integrating instant WhatsApp order formatting.
      Result: Reduced order friction and increased direct client inquiries on mobile.
    `,
    details: [
      'Mobile-first responsive design',
      'Instant WhatsApp order formatting',
      'Fast image asset loading',
      'Hosted on Vercel platform'
    ]
  },
  {
    id: 'fitforge',
    title: 'FitForge',
    desc: 'Personal workout and fitness tracking web app with authenticated user profiles, session logs, and progress metrics.',
    img: fitforgeImg,
    demoLink: 'https://fitforge.vercel.app',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Firebase', 'Authentication'],
    status: 'Live Project',
    caseStudy: `
      Challenge: Build a seamless fitness logging application with persistent state across multiple user authentication sessions.
      Approach: Combined Firebase Authentication with custom state handlers in React for real-time tracking.
      Result: Delivered a reliable, user-friendly fitness dashboard.
    `,
    details: [
      'Firebase Authentication integration',
      'Real-time user session tracking',
      'Interactive dashboard UI',
      'Dark mode UI styling'
    ]
  }
];

export const allProjects = [
  ...featuredProjects,
  {
    id: 'kanflow',
    title: 'KanFlow',
    desc: 'Productivity task management app built with local storage persistence and keyboard shortcuts for rapid task handling.',
    img: demo3Img,
    demoLink: 'https://kanflow.vercel.app',
    tags: ['React', 'JavaScript', 'Tailwind CSS'],
    status: 'Live Project',
    caseStudy: null,
    details: [
      'Kanban column structure',
      'Local storage persistence',
      'Keyboard shortcut support'
    ]
  },
  {
    id: 'netflix-clone',
    title: 'Streamify UI',
    desc: 'Streaming UI prototype integrating movie API collections, watchlist management, and lazy loaded carousels.',
    img: demo4Img,
    demoLink: 'https://streamify-demo.vercel.app',
    tags: ['React', 'TMDB API', 'Firebase', 'Firestore'],
    status: 'Live Project',
    caseStudy: null,
    details: [
      'TMDB API movie fetching',
      'Firebase auth & watchlists',
      'Lazy loaded media carousels'
    ]
  }
];