import { UserProfile, ChromaticSpec } from '../types';

export const CHROMATIC_SPEC_PRESETS: ChromaticSpec[] = [
  {
    name: 'SOLAR RESONANCE',
    dotColor: '#935815', // Warm bronze/gold
    l: 0.85,
    c: 0.12,
    h: 75.5,
    channel: 'SOLAR',
    description: 'Strategic execution, velocity, and delivery drive.'
  },
  {
    name: 'DEEP TEAL ANCHOR',
    dotColor: '#0A6275', // Deep cyan/teal
    l: 0.45,
    c: 0.08,
    h: 220.1,
    channel: 'NEXUS',
    description: 'Cognitive architecture, systems modeling, and domain mastery.'
  },
  {
    name: 'VERDANT SPARK',
    dotColor: '#28976C', // Mint green/emerald
    l: 0.78,
    c: 0.15,
    h: 155.3,
    channel: 'RESONANCE',
    description: 'Ethical governance, psychological safety, and philosophical congruence.'
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'user-current-alex',
  name: 'Alex Mercer',
  title: 'Design Technologist',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  bio: 'Bridging generative AI systems and high-craft human interfaces through rapid prototyping and cognitive architecture.',
  location: 'San Francisco, CA',
  coordinates: { x: 38, y: 35, lat: 37.7749, lng: -122.4194 },
  tier: 'PROFESSIONAL',
  subMode: 'NETWORKING',
  prismId: 'MW-9842-AX',
  verifiedAt: '2024-05-14T08:30:00Z',
  ocean: {
    openness: 94,
    conscientiousness: 88,
    extraversion: 72,
    agreeableness: 91,
    neuroticism: 22
  },
  needsOffers: {
    offers: ['Generative UI', 'Frontend Architecture', 'Design Systems', 'UX Strategy', 'Creative Prototyping'],
    needs: ['Scalable Backend', 'Distributed Systems', 'Data Pipelines', 'Ethical AI Validation'],
    domains: ['Design & AI', 'Enterprise SaaS', 'Creative Tools', 'Autonomous Agents']
  },
  constraints: {
    languages: ['English', 'Spanish'],
    blockedUserIds: [],
    connectionGoals: ['Collaborative Ventures', 'Co-Founding', 'Advisory'],
    location: 'Global / Remote'
  },
  spectrum: {
    solarResonance: 88,
    deepTealAnchor: 92,
    verdantSpark: 96,
    dominantSignature: 'High Blue-Gold Synergy',
    globalSynergyScore: 94,
    chromaticSpecs: CHROMATIC_SPEC_PRESETS
  },
  executionScore: 88,
  capabilityScore: 92,
  resonanceScore: 96,
  availabilityHoursPerWeek: 20,
  communicationLatency: 'Async-first, high depth',
  riskTolerance: 'Experimental iteration with structural safety rails'
};

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'user-sam-reed',
    name: 'Dr. Sam Reed',
    title: 'Data Strategy Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Pioneering mathematical evaluation frameworks and ethical alignment benchmarks for agentic AI architectures.',
    location: 'Seattle, WA',
    coordinates: { x: 42, y: 38, lat: 47.6062, lng: -122.3321 },
    tier: 'PROFESSIONAL',
    subMode: 'NETWORKING',
    prismId: 'MW-7721-SR',
    verifiedAt: '2024-05-12T14:15:00Z',
    ocean: {
      openness: 91,
      conscientiousness: 96,
      extraversion: 65,
      agreeableness: 89,
      neuroticism: 18
    },
    needsOffers: {
      offers: ['Data Architecture', 'Model Benchmarking', 'Data Strategy', 'Distributed Systems', 'Risk Analysis'],
      needs: ['Generative UI', 'Rapid Prototyping', 'Product Storytelling', 'Frontend Architecture'],
      domains: ['Design & AI', 'Deep Tech', 'Enterprise SaaS', 'Research']
    },
    constraints: {
      languages: ['English', 'German'],
      blockedUserIds: [],
      connectionGoals: ['Collaborative Ventures', 'Research Partnerships'],
      location: 'North America / Remote'
    },
    spectrum: {
      solarResonance: 90,
      deepTealAnchor: 95,
      verdantSpark: 92,
      dominantSignature: 'High Blue-Gold Synergy',
      globalSynergyScore: 91,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 90,
    capabilityScore: 95,
    resonanceScore: 92,
    availabilityHoursPerWeek: 18,
    communicationLatency: 'Async-first, structured docs',
    riskTolerance: 'Rigorous validation with controlled experiments'
  },
  {
    id: 'user-elias-thorne',
    name: 'Elias Thorne',
    title: 'Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Specializing in zero-trust distributed backends, deterministic state synchronization, and low-latency microservices.',
    location: 'Austin, TX',
    coordinates: { x: 39, y: 36, lat: 30.2672, lng: -97.7431 },
    tier: 'PROFESSIONAL',
    subMode: 'NETWORKING',
    prismId: 'MW-4109-ET',
    verifiedAt: '2024-05-10T10:00:00Z',
    ocean: {
      openness: 89,
      conscientiousness: 98,
      extraversion: 60,
      agreeableness: 88,
      neuroticism: 15
    },
    needsOffers: {
      offers: ['Distributed Systems', 'Rust / Go Backends', 'Database Sharding', 'Event Streaming', 'Cloud Infra'],
      needs: ['Design Systems', 'Generative UI', 'Product Narrative'],
      domains: ['Enterprise SaaS', 'Cloud Infrastructure', 'FinTech']
    },
    constraints: {
      languages: ['English'],
      blockedUserIds: [],
      connectionGoals: ['Collaborative Ventures', 'Technical Advisory'],
      location: 'Remote'
    },
    spectrum: {
      solarResonance: 96,
      deepTealAnchor: 98,
      verdantSpark: 90,
      dominantSignature: 'Hyper-Structured Solar Nexus',
      globalSynergyScore: 98,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 96,
    capabilityScore: 98,
    resonanceScore: 90,
    availabilityHoursPerWeek: 25,
    communicationLatency: 'High responsiveness, asynchronous PR-driven',
    riskTolerance: 'Pragmatic security and bulletproof fallbacks'
  },
  {
    id: 'user-aria-vance',
    name: 'Aria Vance',
    title: 'Ethical AI Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    bio: 'Guiding constitutional AI principles, explainable algorithmic transparency, and human-in-the-loop governance.',
    location: 'Boston, MA',
    coordinates: { x: 41, y: 37, lat: 42.3601, lng: -71.0589 },
    tier: 'PROFESSIONAL',
    subMode: 'NETWORKING',
    prismId: 'MW-6302-AV',
    verifiedAt: '2024-05-08T16:20:00Z',
    ocean: {
      openness: 95,
      conscientiousness: 92,
      extraversion: 76,
      agreeableness: 97,
      neuroticism: 14
    },
    needsOffers: {
      offers: ['Algorithmic Auditing', 'Constitutional AI', 'AI Safety Policies', 'Ethics Governance'],
      needs: ['Interactive Visualizations', 'Scalable Backend'],
      domains: ['Deep Tech', 'AI Governance', 'Research']
    },
    constraints: {
      languages: ['English', 'French'],
      blockedUserIds: [],
      connectionGoals: ['Research Partnerships', 'Advisory'],
      location: 'East Coast / Remote'
    },
    spectrum: {
      solarResonance: 89,
      deepTealAnchor: 93,
      verdantSpark: 99,
      dominantSignature: 'Resonant Verdant Anchor',
      globalSynergyScore: 94,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 89,
    capabilityScore: 93,
    resonanceScore: 99,
    availabilityHoursPerWeek: 15,
    communicationLatency: 'Structured weekly synthesis',
    riskTolerance: 'Preventative safety with ethical boundary checking'
  },
  {
    id: 'user-julian-cross',
    name: 'Julian Cross',
    title: 'Operations Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: 'Scaling high-velocity engineering workflows, cross-functional organizational cadence, and capital allocation.',
    location: 'New York, NY',
    coordinates: { x: 70, y: 48, lat: 40.7128, lng: -74.0060 },
    tier: 'COLLABORATIVE',
    subMode: 'HACKATHON_TEAMS',
    prismId: 'MW-5519-JC',
    verifiedAt: '2024-05-05T09:45:00Z',
    ocean: {
      openness: 82,
      conscientiousness: 95,
      extraversion: 88,
      agreeableness: 84,
      neuroticism: 20
    },
    needsOffers: {
      offers: ['Operational Cadence', 'Project Management', 'Financial Modeling', 'Team Scaling'],
      needs: ['Technical Architecture', 'UX Design Systems'],
      domains: ['Enterprise SaaS', 'Operations', 'Venture Studio']
    },
    constraints: {
      languages: ['English'],
      blockedUserIds: [],
      connectionGoals: ['Collaborative Ventures', 'Project Groups'],
      location: 'New York / Hybrid'
    },
    spectrum: {
      solarResonance: 94,
      deepTealAnchor: 85,
      verdantSpark: 88,
      dominantSignature: 'Solar Momentum Lead',
      globalSynergyScore: 89,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 94,
    capabilityScore: 85,
    resonanceScore: 88,
    availabilityHoursPerWeek: 30,
    communicationLatency: 'Rapid synchronous bursts & clear dashboards',
    riskTolerance: 'Calculated milestones with sprint velocity'
  },
  {
    id: 'user-elena-rostova',
    name: 'Elena Rostova',
    title: 'Deep Learning Scientist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    bio: 'Exploring sparse attention mechanisms, multimodal latent embeddings, and mechanistic interpretability.',
    location: 'Zurich, CH',
    coordinates: { x: 21, y: 58, lat: 47.3769, lng: 8.5417 },
    tier: 'PROFESSIONAL',
    subMode: 'MENTORSHIP',
    prismId: 'MW-8831-ER',
    verifiedAt: '2024-05-02T11:30:00Z',
    ocean: {
      openness: 98,
      conscientiousness: 91,
      extraversion: 55,
      agreeableness: 90,
      neuroticism: 25
    },
    needsOffers: {
      offers: ['PyTorch', 'Transformer Architecture', 'Attention Optimization', 'Research Papers'],
      needs: ['Full-Stack Deployment', 'Product Packaging', 'Cloud GPU Orchestration'],
      domains: ['Deep Tech', 'Research', 'Machine Learning']
    },
    constraints: {
      languages: ['English', 'Russian', 'German'],
      blockedUserIds: [],
      connectionGoals: ['Research Partnerships', 'Mentorship'],
      location: 'Europe / Remote'
    },
    spectrum: {
      solarResonance: 86,
      deepTealAnchor: 99,
      verdantSpark: 91,
      dominantSignature: 'Deep Cognitive Nexus',
      globalSynergyScore: 93,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 86,
    capabilityScore: 99,
    resonanceScore: 91,
    availabilityHoursPerWeek: 20,
    communicationLatency: 'Async-first, technical notebooks',
    riskTolerance: 'Deep exploratory research with high upside'
  },
  {
    id: 'user-marcus-chen',
    name: 'Marcus Chen',
    title: 'Creative Director & Visual Storyteller',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    bio: 'Crafting brand worlds, typography rhythm, and cinematic interactive journeys for next-generation products.',
    location: 'Tokyo, JP',
    coordinates: { x: 43, y: 39, lat: 35.6762, lng: 139.6503 },
    tier: 'PERSONAL',
    subMode: 'FRIENDS',
    prismId: 'MW-3190-MC',
    verifiedAt: '2024-05-01T07:10:00Z',
    ocean: {
      openness: 96,
      conscientiousness: 84,
      extraversion: 78,
      agreeableness: 93,
      neuroticism: 28
    },
    needsOffers: {
      offers: ['Art Direction', 'Typography', 'Motion Design', 'Brand Strategy', 'Visual Identity'],
      needs: ['Code Implementation', 'WebGL Pipelines'],
      domains: ['Creative Tools', 'Design & AI', 'Media']
    },
    constraints: {
      languages: ['English', 'Japanese'],
      blockedUserIds: [],
      connectionGoals: ['Friends', 'Creative Projects', 'Activity Partners'],
      location: 'Tokyo / Global'
    },
    spectrum: {
      solarResonance: 85,
      deepTealAnchor: 91,
      verdantSpark: 95,
      dominantSignature: 'Luminescent Creative Prism',
      globalSynergyScore: 90,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 85,
    capabilityScore: 91,
    resonanceScore: 95,
    availabilityHoursPerWeek: 22,
    communicationLatency: 'Visual moodboards and responsive chat',
    riskTolerance: 'Bold aesthetic experimentation'
  },
  {
    id: 'user-sophie-dubois',
    name: 'Sophie Dubois',
    title: 'Human-AI Interaction Researcher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Investigating multimodal tactile interfaces, cognitive load reduction, and empathetic agent design.',
    location: 'Paris, FR',
    coordinates: { x: 50, y: 45, lat: 48.8566, lng: 2.3522 },
    tier: 'PROFESSIONAL',
    subMode: 'NETWORKING',
    prismId: 'MW-9120-SD',
    verifiedAt: '2024-05-15T09:00:00Z',
    ocean: {
      openness: 94,
      conscientiousness: 89,
      extraversion: 70,
      agreeableness: 95,
      neuroticism: 16
    },
    needsOffers: {
      offers: ['HCI Research', 'Cognitive Modeling', 'Usability Testing', 'Academic Publishing'],
      needs: ['Full-Stack Implementation', 'Real-time Telemetry'],
      domains: ['Design & AI', 'Research', 'Cognitive Science']
    },
    constraints: {
      languages: ['English', 'French'],
      blockedUserIds: [],
      connectionGoals: ['Collaborative Ventures', 'Research Partnerships'],
      location: 'Europe / Remote'
    },
    spectrum: {
      solarResonance: 87,
      deepTealAnchor: 94,
      verdantSpark: 97,
      dominantSignature: 'Verdant Nexus Resonance',
      globalSynergyScore: 93,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 87,
    capabilityScore: 94,
    resonanceScore: 97,
    availabilityHoursPerWeek: 16,
    communicationLatency: 'Bi-weekly synchronous deep dives',
    riskTolerance: 'Evidence-based iterative validation'
  },
  {
    id: 'user-tariq-al-mansoor',
    name: 'Tariq Al-Mansoor',
    title: 'Distributed Infrastructure Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: 'Architecting zero-downtime multi-cloud clusters, high-throughput message brokers, and low-latency edge computing.',
    location: 'London, UK',
    coordinates: { x: 48, y: 40, lat: 51.5074, lng: -0.1278 },
    tier: 'COLLABORATIVE',
    subMode: 'HACKATHON_TEAMS',
    prismId: 'MW-4882-TM',
    verifiedAt: '2024-05-18T12:00:00Z',
    ocean: {
      openness: 88,
      conscientiousness: 97,
      extraversion: 62,
      agreeableness: 86,
      neuroticism: 12
    },
    needsOffers: {
      offers: ['Kubernetes Orchestration', 'Rust Engine', 'Edge Caching', 'Security Audits'],
      needs: ['Generative UI', 'Front-End Polish', 'Product Strategy'],
      domains: ['Enterprise SaaS', 'Cloud Infrastructure', 'FinTech']
    },
    constraints: {
      languages: ['English', 'Arabic'],
      blockedUserIds: [],
      connectionGoals: ['Hackathon Teams', 'Co-Founding'],
      location: 'UK / Europe'
    },
    spectrum: {
      solarResonance: 95,
      deepTealAnchor: 97,
      verdantSpark: 89,
      dominantSignature: 'Solar Deep Teal Matrix',
      globalSynergyScore: 96,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 95,
    capabilityScore: 97,
    resonanceScore: 89,
    availabilityHoursPerWeek: 25,
    communicationLatency: 'Real-time chat & async PR reviews',
    riskTolerance: 'Calculated high-throughput resilience'
  },
  {
    id: 'user-kenji-sato',
    name: 'Kenji Sato',
    title: 'Full-Stack Spatial Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Building WebGPU shaders, interactive cartography tools, and real-time collaborative map canvases.',
    location: 'Singapore, SG',
    coordinates: { x: 55, y: 60, lat: 1.3521, lng: 103.8198 },
    tier: 'COLLABORATIVE',
    subMode: 'PROJECT_GROUPS',
    prismId: 'MW-7104-KS',
    verifiedAt: '2024-05-20T15:30:00Z',
    ocean: {
      openness: 95,
      conscientiousness: 90,
      extraversion: 74,
      agreeableness: 91,
      neuroticism: 17
    },
    needsOffers: {
      offers: ['WebGL / Three.js', 'Leaflet / Mapbox GIS', 'React Architecture', 'Shader Programming'],
      needs: ['AI Model Integration', 'Backend Pipelines'],
      domains: ['Design & AI', 'Creative Tools', 'Spatial Computing']
    },
    constraints: {
      languages: ['English', 'Japanese', 'Mandarin'],
      blockedUserIds: [],
      connectionGoals: ['Collaborative Ventures', 'Project Groups'],
      location: 'Asia-Pacific / Remote'
    },
    spectrum: {
      solarResonance: 92,
      deepTealAnchor: 96,
      verdantSpark: 93,
      dominantSignature: 'Cyan Emerald Vector',
      globalSynergyScore: 94,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 92,
    capabilityScore: 96,
    resonanceScore: 93,
    availabilityHoursPerWeek: 20,
    communicationLatency: 'Async-first with clear visual demos',
    riskTolerance: 'Rapid visual prototypes'
  },
  {
    id: 'user-chloe-lin',
    name: 'Chloe Lin',
    title: 'Interaction Architect & Writer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    bio: 'Exploring contemplative computing, cognitive empathy, and long-term philosophical connection in digital spaces.',
    location: 'Vancouver, BC',
    coordinates: { x: 35, y: 32, lat: 49.2827, lng: -123.1207 },
    tier: 'PERSONAL',
    subMode: 'DATING',
    prismId: 'MW-2940-CL',
    verifiedAt: '2024-05-22T08:15:00Z',
    ocean: {
      openness: 97,
      conscientiousness: 86,
      extraversion: 72,
      agreeableness: 96,
      neuroticism: 19
    },
    needsOffers: {
      offers: ['Contemplative Design', 'Narrative Craft', 'Empathy Frameworks', 'Creative Writing'],
      needs: ['Philosophical Depth', 'Shared Vulnerability', 'Musical Appreciation'],
      domains: ['Personal Connection', 'Literature', 'Mindfulness', 'Design & AI']
    },
    constraints: {
      languages: ['English', 'Mandarin'],
      blockedUserIds: [],
      connectionGoals: ['Dating', 'Long-Term Alignment', 'Philosophical Exchange'],
      location: 'Pacific Northwest / Remote'
    },
    spectrum: {
      solarResonance: 84,
      deepTealAnchor: 92,
      verdantSpark: 98,
      dominantSignature: 'Verdant Rose Synthesis',
      globalSynergyScore: 95,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 84,
    capabilityScore: 92,
    resonanceScore: 98,
    availabilityHoursPerWeek: 15,
    communicationLatency: 'Thoughtful async letters & intentional coffee walks',
    riskTolerance: 'Open-hearted authenticity'
  },
  {
    id: 'user-mateo-silva',
    name: 'Mateo Silva',
    title: 'Outdoor Expeditionist & Audio Creator',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    bio: 'Organizing alpine trail runs, analog synth field recordings, and weekend creative bouldering cohorts.',
    location: 'Barcelona, ES',
    coordinates: { x: 52, y: 50, lat: 41.3879, lng: 2.1699 },
    tier: 'PERSONAL',
    subMode: 'ACTIVITIES',
    prismId: 'MW-6518-MS',
    verifiedAt: '2024-05-25T14:40:00Z',
    ocean: {
      openness: 93,
      conscientiousness: 88,
      extraversion: 85,
      agreeableness: 92,
      neuroticism: 14
    },
    needsOffers: {
      offers: ['Trail Navigation', 'Analog Audio Recording', 'Rock Climbing', 'Spanish Cooking'],
      needs: ['Bouldering Partners', 'Field Recording Collaborators', 'Creative Companionship'],
      domains: ['Outdoors & Athletics', 'Audio Synthesis', 'Culinary Arts']
    },
    constraints: {
      languages: ['Spanish', 'Catalan', 'English'],
      blockedUserIds: [],
      connectionGoals: ['Activity Partners', 'Friends', 'Expeditions'],
      location: 'Barcelona / Pyrenees'
    },
    spectrum: {
      solarResonance: 91,
      deepTealAnchor: 88,
      verdantSpark: 96,
      dominantSignature: 'Solar Verdant Cadence',
      globalSynergyScore: 92,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 91,
    capabilityScore: 88,
    resonanceScore: 96,
    availabilityHoursPerWeek: 18,
    communicationLatency: 'Real-time weekend plans & voice notes',
    riskTolerance: 'High outdoor energy and calculated physical agility'
  },
  {
    id: 'user-maya-patel',
    name: 'Maya Patel',
    title: 'Founding VP of Engineering & Mentor',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
    bio: 'Mentoring emerging engineering directors, scaling distributed systems from seed to Series C, and engineering leadership.',
    location: 'Bengaluru, IN',
    coordinates: { x: 62, y: 55, lat: 12.9716, lng: 77.5946 },
    tier: 'PROFESSIONAL',
    subMode: 'MENTORSHIP',
    prismId: 'MW-8092-MP',
    verifiedAt: '2024-05-26T10:20:00Z',
    ocean: {
      openness: 90,
      conscientiousness: 98,
      extraversion: 75,
      agreeableness: 94,
      neuroticism: 11
    },
    needsOffers: {
      offers: ['Executive Coaching', 'Org Design', 'High-Scale Architecture', 'Fundraising Technical DD'],
      needs: ['Mentees in Deep Tech', 'Frontier AI Research Updates'],
      domains: ['Enterprise SaaS', 'Engineering Leadership', 'Mentorship', 'FinTech']
    },
    constraints: {
      languages: ['English', 'Hindi', 'Kannada'],
      blockedUserIds: [],
      connectionGoals: ['Mentorship', 'Advisory', 'Strategic Networking'],
      location: 'India / Global Remote'
    },
    spectrum: {
      solarResonance: 93,
      deepTealAnchor: 99,
      verdantSpark: 94,
      dominantSignature: 'Oceanic Cobalt Anchor',
      globalSynergyScore: 97,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 93,
    capabilityScore: 99,
    resonanceScore: 94,
    availabilityHoursPerWeek: 12,
    communicationLatency: 'Structured bi-weekly 1:1 mentorship sessions',
    riskTolerance: 'Principled long-term career bets'
  },
  {
    id: 'user-zara-novak',
    name: 'Zara Novak',
    title: 'Autonomous Agent Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Building tool-augmented LLM swarms, MCP protocol integrations, and 48-hour prototype shipping machines.',
    location: 'Berlin, DE',
    coordinates: { x: 49, y: 42, lat: 52.5200, lng: 13.4050 },
    tier: 'COLLABORATIVE',
    subMode: 'HACKATHON_TEAMS',
    prismId: 'MW-3381-ZN',
    verifiedAt: '2024-05-28T18:00:00Z',
    ocean: {
      openness: 96,
      conscientiousness: 94,
      extraversion: 80,
      agreeableness: 89,
      neuroticism: 15
    },
    needsOffers: {
      offers: ['Agentic Swarms', 'Python / FastMCP', 'LangGraph / LlamaIndex', 'Hackathon Velocity'],
      needs: ['Product Design', 'Generative UI', 'Front-End Polish'],
      domains: ['Autonomous Agents', 'Hackathons', 'Deep Tech', 'AI Infrastructure']
    },
    constraints: {
      languages: ['English', 'German'],
      blockedUserIds: [],
      connectionGoals: ['Hackathon Teams', 'Co-Founding', 'Project Groups'],
      location: 'Berlin / Europe / Remote'
    },
    spectrum: {
      solarResonance: 98,
      deepTealAnchor: 95,
      verdantSpark: 88,
      dominantSignature: 'Solar Amethyst High-Velocity Core',
      globalSynergyScore: 96,
      chromaticSpecs: CHROMATIC_SPEC_PRESETS
    },
    executionScore: 98,
    capabilityScore: 95,
    resonanceScore: 88,
    availabilityHoursPerWeek: 28,
    communicationLatency: 'Discord/Slack rapid turnaround, live pair programming',
    riskTolerance: 'Extreme velocity with rapid iteration cycles'
  }
];
