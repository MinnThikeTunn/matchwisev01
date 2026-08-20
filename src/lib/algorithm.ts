import {
  UserProfile,
  MatchResult,
  IntentSubMode,
  KeyDriver,
  ArchetypalMetric,
  CriteriaCardData,
} from '../types';

/**
 * Evaluates Hard Boundary Gate G in {0, 1}
 */
export function evaluateHardBoundary(userA: UserProfile, userB: UserProfile): { passed: boolean; reason?: string } {
  // Check blocked users
  if (userA.constraints.blockedUserIds?.includes(userB.id) || userB.constraints.blockedUserIds?.includes(userA.id)) {
    return { passed: false, reason: 'Candidate is on blocked list' };
  }

  // Check language compatibility
  const sharedLanguages = userA.constraints.languages.filter(l => userB.constraints.languages.includes(l));
  if (userA.constraints.languages.length > 0 && userB.constraints.languages.length > 0 && sharedLanguages.length === 0) {
    return { passed: false, reason: 'No shared communication language' };
  }

  return { passed: true };
}

/**
 * Calculates System Confidence Factor C in [0, 1]
 * Missing data reduces C, never S
 */
export function calculateConfidence(userA: UserProfile, userB: UserProfile): number {
  let scorePoints = 0;
  let maxPoints = 6;

  if (userA.ocean && userB.ocean) scorePoints += 2;
  if (userA.needsOffers.offers.length > 0 && userB.needsOffers.needs.length > 0) scorePoints += 1;
  if (userA.needsOffers.needs.length > 0 && userB.needsOffers.offers.length > 0) scorePoints += 1;
  if (userA.constraints.connectionGoals.length > 0 && userB.constraints.connectionGoals.length > 0) scorePoints += 1;
  if (userA.availabilityHoursPerWeek > 0 && userB.availabilityHoursPerWeek > 0) scorePoints += 1;

  return Math.min(1.0, Math.max(0.65, scorePoints / maxPoints));
}

/**
 * Tier 1: Personal Engine Compatibility S_personal
 */
export function computePersonalScore(userA: UserProfile, userB: UserProfile, subMode: IntentSubMode): {
  score: number;
  drivers: KeyDriver[];
} {
  // Weights based on subMode
  let wAttr = 0.05, wFuture = 0.10, wProc = 0.20, wDaily = 0.35, wPrac = 0.30;
  if (subMode === 'DATING') {
    wAttr = 0.35; wFuture = 0.25; wProc = 0.20; wDaily = 0.10; wPrac = 0.10;
  } else if (subMode === 'ACTIVITIES') {
    wAttr = 0.05; wFuture = 0.05; wProc = 0.10; wDaily = 0.40; wPrac = 0.40;
  }

  // Sub-scores
  const sAttr = Math.max(0.5, 1 - Math.abs(userA.ocean.extraversion - userB.ocean.extraversion) / 150);
  const sFuture = Math.max(0.6, 1 - Math.abs(userA.ocean.openness - userB.ocean.openness) / 200);
  const sProc = Math.max(0.5, 1 - Math.abs(userA.ocean.agreeableness - userB.ocean.agreeableness) / 120);
  const sDaily = Math.max(0.6, 1 - Math.abs(userA.ocean.conscientiousness - userB.ocean.conscientiousness) / 160);
  const sPrac = Math.max(0.7, 1 - Math.abs(userA.availabilityHoursPerWeek - userB.availabilityHoursPerWeek) / 40);

  const score = (wAttr * sAttr) + (wFuture * sFuture) + (wProc * sProc) + (wDaily * sDaily) + (wPrac * sPrac);

  const drivers: KeyDriver[] = [
    {
      title: 'Shared Philosophical Harmony',
      description: 'Strong alignment in fundamental ethics and worldview provides deep communicative empathy.',
      type: 'values',
      scoreImpact: Math.round(sProc * 100)
    },
    {
      title: 'Synchronized Social Rhythm',
      description: 'Compatible energy expenditure cycles and preferred interaction latency.',
      type: 'communication',
      scoreImpact: Math.round(sDaily * 100)
    }
  ];

  return { score, drivers };
}

/**
 * Tier 2: Professional Engine Compatibility S_professional
 * Asymmetric Needs <-> Offers dot product
 */
export function computeProfessionalScore(userA: UserProfile, userB: UserProfile, subMode: IntentSubMode): {
  score: number;
  drivers: KeyDriver[];
} {
  // Exchange A -> B: (O_A . N_B) / (||N_B|| + eps)
  const offersA = userA.needsOffers.offers;
  const needsB = userB.needsOffers.needs;
  const offersB = userB.needsOffers.offers;
  const needsA = userA.needsOffers.needs;

  const matchAtoB = needsB.filter(n => offersA.some(o => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()))).length;
  const sExchAtoB = (matchAtoB + 1.2) / (Math.max(1, needsB.length) + 0.8);

  const matchBtoA = needsA.filter(n => offersB.some(o => o.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(o.toLowerCase()))).length;
  const sExchBtoA = (matchBtoA + 1.2) / (Math.max(1, needsA.length) + 0.8);

  const sExchTotal = Math.min(1.0, (sExchAtoB + sExchBtoA) / 2);

  // Goals & Domain Fit
  const sharedDomains = userA.needsOffers.domains.filter(d => userB.needsOffers.domains.includes(d));
  const sDomain = Math.min(1.0, 0.7 + (sharedDomains.length * 0.15));
  const sGoals = Math.max(0.7, 1 - Math.abs(userA.ocean.conscientiousness - userB.ocean.conscientiousness) / 200);
  const sAvail = Math.max(0.65, 1 - Math.abs(userA.availabilityHoursPerWeek - userB.availabilityHoursPerWeek) / 45);

  let wExch = 0.40, wGoals = 0.30, wDomain = 0.15, wAvail = 0.15;
  if (subMode === 'MENTORSHIP') {
    wExch = 0.50; wGoals = 0.25; wDomain = 0.15; wAvail = 0.10;
  } else if (subMode === 'STUDY_PARTNERS') {
    wExch = 0.35; wGoals = 0.35; wDomain = 0.20; wAvail = 0.10;
  }

  const score = (wExch * sExchTotal) + (wGoals * sGoals) + (wDomain * sDomain) + (wAvail * sAvail);

  const drivers: KeyDriver[] = [
    {
      title: 'Strong Technical Overlap',
      description: 'Shared expertise in generative models and scalable architecture provides a frictionless foundation for co-creation.',
      type: 'technical',
      scoreImpact: Math.round(sExchTotal * 100)
    },
    {
      title: 'Aligned Communication Latency',
      description: 'Both profiles exhibit high responsiveness and a preference for asynchronous, documentation-heavy collaboration.',
      type: 'communication',
      scoreImpact: Math.round(sAvail * 100)
    },
    {
      title: 'Complementary Risk Tolerance',
      description: 'One profile leans towards experimental iteration, while the other emphasizes rigorous validation, creating a stable innovation cycle.',
      type: 'risk',
      scoreImpact: Math.round(sGoals * 100)
    }
  ];

  return { score, drivers };
}

/**
 * Tier 3: Collaborative Engine Group & Task Optimization
 */
export function computeCollaborativeScore(team: UserProfile[], criteria?: CriteriaCardData): number {
  if (team.length === 0) return 0;
  
  // Skill coverage
  const allOffers = team.flatMap(u => u.needsOffers.offers);
  const uniqueOffers = new Set(allOffers.map(o => o.toLowerCase()));
  const coverageScore = Math.min(1.0, uniqueOffers.size / 6);

  // Competence
  const avgExecution = team.reduce((acc, u) => acc + u.executionScore, 0) / (team.length * 100);
  const avgCapability = team.reduce((acc, u) => acc + u.capabilityScore, 0) / (team.length * 100);
  const competenceScore = (avgExecution * 0.5) + (avgCapability * 0.5);

  // Overlap & Schedule
  const avgAvail = team.reduce((acc, u) => acc + u.availabilityHoursPerWeek, 0) / team.length;
  const availScore = Math.min(1.0, avgAvail / 25);

  // Role imbalance penalty
  const pRole = team.length > 3 ? 0.05 : 0.0;

  const fTeam = (0.45 * coverageScore) + (0.35 * competenceScore) + (0.20 * availScore) - pRole;
  return Math.min(1.0, Math.max(0.4, fTeam));
}

/**
 * Unified Recommendation Pipeline: Final Match Score = G * S * C
 */
export function evaluatePairwiseMatch(
  requester: UserProfile,
  candidate: UserProfile,
  intentOverride?: IntentSubMode
): MatchResult {
  const subMode = intentOverride || candidate.subMode || requester.subMode || 'NETWORKING';
  
  // 1. Evaluate Hard Boundary Gate G
  const gateResult = evaluateHardBoundary(requester, candidate);
  const G = gateResult.passed ? 1 : 0;

  // 2. Contextual Tier Scoring S
  let S = 0.85;
  let keyDrivers: KeyDriver[] = [];

  if (['DATING', 'FRIENDS', 'ACTIVITIES'].includes(subMode)) {
    const res = computePersonalScore(requester, candidate, subMode);
    S = res.score;
    keyDrivers = res.drivers;
  } else if (['NETWORKING', 'MENTORSHIP', 'STUDY_PARTNERS'].includes(subMode)) {
    const res = computeProfessionalScore(requester, candidate, subMode);
    S = res.score;
    keyDrivers = res.drivers;
  } else {
    // Collaborative pairwise
    S = ((requester.capabilityScore + candidate.capabilityScore) / 200) * 0.5 + 
        ((requester.executionScore + candidate.executionScore) / 200) * 0.5;
    keyDrivers = [
      {
        title: 'High Execution Velocity',
        description: 'Combined delivery throughput exceeds baseline group targets.',
        type: 'technical',
        scoreImpact: 92
      },
      {
        title: 'Complementary Architecture Focus',
        description: 'Frontend visual polish pairs seamlessly with deep systems engineering.',
        type: 'technical',
        scoreImpact: 89
      }
    ];
  }

  // 3. System Confidence Factor C
  const C = calculateConfidence(requester, candidate);

  // 4. Final Match Score = G * S * C
  const finalPercentage = Math.round(G * S * C * 100);

  // Determine synergy label & archetypal metrics
  let synergyLabel = 'High Blue-Gold Synergy';
  let synergyDescription = 'A holistic balance of technical precision and communicative resonance. This connection demonstrates exceptional potential for collaborative success.';

  if (finalPercentage >= 95) {
    synergyLabel = 'Exceptional Tri-Chromatic Resonance';
    synergyDescription = 'Remarkable multi-dimensional alignment across strategic execution, cognitive architecture, and ethical grounding.';
  } else if (finalPercentage >= 90) {
    synergyLabel = 'High Blue-Gold Synergy';
    synergyDescription = 'A holistic balance of technical precision and communicative resonance. This connection demonstrates exceptional potential for collaborative success.';
  } else if (finalPercentage >= 80) {
    synergyLabel = 'Complementary Kinetic Fit';
    synergyDescription = 'Strong asymmetrical utility with balanced velocity and constructive creative tension.';
  } else {
    synergyLabel = 'Emergent Synergy Potential';
    synergyDescription = 'Focused point-to-point compatibility suited for exploratory interactions.';
  }

  const focusScore = Math.round(Math.min(99, Math.max(70, ((requester.executionScore + candidate.executionScore) / 2) + 2)));
  const clarityScore = Math.round(Math.min(99, Math.max(70, ((requester.capabilityScore + candidate.capabilityScore) / 2) - 3)));
  const agilityScore = Math.round(Math.min(99, Math.max(70, ((requester.resonanceScore + candidate.resonanceScore) / 2) + 1)));

  const archetypalMetrics: ArchetypalMetric[] = [
    {
      name: 'Focus & Execution',
      percentage: focusScore,
      color: '#B5751E', // Gold/Bronze
      iconType: 'circle'
    },
    {
      name: 'Clarity & Structure',
      percentage: clarityScore,
      color: '#0D7A94', // Teal/Cyan
      iconType: 'triangle-left'
    },
    {
      name: 'Agility & Vision',
      percentage: agilityScore,
      color: '#0E9365', // Green/Verdant
      iconType: 'triangle-up'
    }
  ];

  return {
    candidate,
    requester,
    hardGatePassed: G === 1,
    gateFailureReason: gateResult.reason,
    rawCompatibilityScore: Number(S.toFixed(3)),
    confidenceFactor: Number(C.toFixed(3)),
    finalMatchScore: finalPercentage,
    synergyLabel,
    synergyDescription,
    keyDrivers,
    archetypalMetrics,
    holisticBalance: finalPercentage
  };
}
