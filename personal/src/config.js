module.exports = {
  siteTitle: 'Larry Agbana | Software Engineer',
  siteDescription:
    'Larry Agbana is a software engineer who specializes in building exceptional digital experiences and architecting scalable applications.',
  siteKeywords:
    'Larry Agbana, Larry, Agbana, Lagbana, software engineer, back-end engineer, web developer, javascript, react, go, python',
  siteUrl: 'https://larryagbana.com',
  siteLanguage: 'en_US',
  // googleAnalyticsID: 'UA-127188467-2',
  // googleVerification: 'zWJzGMVk8J4FpXsLNpt7CB17SPaa2_ti9YfdGwnGr00',
  name: 'Larry Agbana',
  location: 'Ontario, Canada',
  email: 'larryagbana@gmail.com',
  github: 'https://github.com/Lagbana',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/Lagbana',
    },
    {
      name: 'Linkedin',
      url: 'https://linkedin.com/in/larryagbana',
    },
  ],
  lastUpdated: '08-June-2023',

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
