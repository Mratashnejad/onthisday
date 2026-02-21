import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  CompetitionLevel,
  Gender,
  ParticipantRole,
  PersonalStatus,
  PersonsPageDocument,
  type PersonsPageQuery,
  type PersonsPageQueryVariables,
  SportEventDetailDocument,
  type SportEventDetailQuery,
  type SportEventDetailQueryVariables,
  SportEventType,
  SportEventsPageDocument,
  type SportEventsPageQuery,
  type SportEventsPageQueryVariables,
  SportType,
} from "@/gql/graphql";

type MockSport = SportEventsPageQuery["sports"][number];
type MockEvent = SportEventsPageQuery["sportEvents"][number];
type MockPerson = PersonsPageQuery["persons"][number];
type MockEventDetail = NonNullable<SportEventDetailQuery["sportEvent"]>;

const mockSports: MockSport[] = [
  {
    id: 1,
    name: "Football",
    slug: "football",
    description: "Mock football events.",
    iconUrl: "https://picsum.photos/seed/mock-football/256/256",
    type: SportType.Team,
  },
  {
    id: 2,
    name: "Basketball",
    slug: "basketball",
    description: "Mock basketball events.",
    iconUrl: "https://picsum.photos/seed/mock-basketball/256/256",
    type: SportType.Team,
  },
  {
    id: 3,
    name: "Tennis",
    slug: "tennis",
    description: "Mock tennis events.",
    iconUrl: "https://picsum.photos/seed/mock-tennis/256/256",
    type: SportType.Individual,
  },
];

const mockTeams = [
  { id: 1, name: "Mock United", slug: "mock-united" },
  { id: 2, name: "Mock City", slug: "mock-city" },
  { id: 3, name: "Mock Aces", slug: "mock-aces" },
] as const;

const mockPersons: MockPerson[] = [
  {
    id: 1,
    firstname: "Ali",
    lastname: "Karimi",
    slug: "ali-karimi",
    title: "Legendary midfielder",
    nationality: "Iran",
    birthDate: "1978-11-08T00:00:00.000Z",
    deathDate: null,
    biography: "Sample profile for development mode.",
    profileImageUrl: "https://picsum.photos/seed/mock-person-1/900/600",
    gender: Gender.Male,
    status: PersonalStatus.Retired,
    sports: [pickSportSummary(1)],
    teams: [mockTeams[0]],
  },
  {
    id: 2,
    firstname: "Sara",
    lastname: "Rahimi",
    slug: "sara-rahimi",
    title: "National champion",
    nationality: "Iran",
    birthDate: "1993-03-14T00:00:00.000Z",
    deathDate: null,
    biography: "Sample active athlete record.",
    profileImageUrl: "https://picsum.photos/seed/mock-person-2/900/600",
    gender: Gender.Female,
    status: PersonalStatus.Active,
    sports: [pickSportSummary(3)],
    teams: [mockTeams[2]],
  },
  {
    id: 3,
    firstname: "Reza",
    lastname: "Moradi",
    slug: "reza-moradi",
    title: "Historic coach",
    nationality: "Iran",
    birthDate: "1956-07-02T00:00:00.000Z",
    deathDate: "2022-05-20T00:00:00.000Z",
    biography: "Sample deceased profile used by fallback mock.",
    profileImageUrl: "https://picsum.photos/seed/mock-person-3/900/600",
    gender: Gender.Male,
    status: PersonalStatus.Deceased,
    sports: [pickSportSummary(2)],
    teams: [mockTeams[1]],
  },
];

function pickSportSummary(sportId: number): { id: number; name: string; slug: string } {
  const sport = mockSports.find((item) => item.id === sportId) ?? mockSports[0];
  return {
    id: sport.id,
    name: sport.name,
    slug: sport.slug,
  };
}

function buildMockEvent(day: number, month: number, variant: 1 | 2 | 3): MockEvent {
  const sport = mockSports[(variant - 1) % mockSports.length];
  const id = month * 1000 + day * 10 + variant;

  if (variant === 1) {
    return {
      id,
      slug: `fa-birthday-mock-${month}-${day}-${variant}`,
      year: 1990,
      month,
      day,
      headline: "Birthday of a sports legend",
      fullDescription: "Mock birthday event generated locally.",
      mediaUrl: `https://picsum.photos/seed/mock-event-${id}/1200/700`,
      type: SportEventType.Achievement,
      sport: pickSportSummary(sport.id),
    };
  }

  if (variant === 2) {
    return {
      id,
      slug: `fa-death-mock-${month}-${day}-${variant}`,
      year: 2008,
      month,
      day,
      headline: "Memorial day for a famous athlete",
      fullDescription: "Mock remembrance event generated locally.",
      mediaUrl: `https://picsum.photos/seed/mock-event-${id}/1200/700`,
      type: SportEventType.Other,
      sport: pickSportSummary(sport.id),
    };
  }

  return {
    id,
    slug: `mock-event-${month}-${day}-${variant}`,
    year: 2019,
    month,
    day,
    headline: "Classic match remembered in history",
    fullDescription: "Mock match result event generated locally.",
    mediaUrl: `https://picsum.photos/seed/mock-event-${id}/1200/700`,
    type: SportEventType.MatchResult,
    sport: pickSportSummary(sport.id),
  };
}

function buildEventsForDate(day: number, month: number): MockEvent[] {
  return [buildMockEvent(day, month, 1), buildMockEvent(day, month, 2), buildMockEvent(day, month, 3)];
}

function decodeMockEventId(id: number): { day: number; month: number; variant: 1 | 2 | 3 } | null {
  const variant = id % 10;
  const day = Math.floor(id / 10) % 100;
  const month = Math.floor(id / 1000);

  if ((variant !== 1 && variant !== 2 && variant !== 3) || day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  return { day, month, variant };
}

function buildMockSportEventsPageData(variables: SportEventsPageQueryVariables): SportEventsPageQuery {
  const eventsForDay = buildEventsForDate(variables.day, variables.month);
  const filteredEvents = variables.sportSlug
    ? eventsForDay.filter((event) => event.sport?.slug === variables.sportSlug)
    : eventsForDay;

  return {
    sports: mockSports,
    sportEvents: filteredEvents,
  };
}

function buildMockPersonsData(variables: PersonsPageQueryVariables): PersonsPageQuery {
  const persons = variables.status
    ? mockPersons.filter((person) => person.status === variables.status)
    : mockPersons;

  return {
    persons,
  };
}

function buildMockSportEventDetailData(variables: SportEventDetailQueryVariables): SportEventDetailQuery {
  const parsed = decodeMockEventId(variables.id);

  if (!parsed) {
    return { sportEvent: null };
  }

  const base = buildMockEvent(parsed.day, parsed.month, parsed.variant);
  const detail: MockEventDetail = {
    id: base.id,
    slug: base.slug,
    headline: base.headline,
    fullDescription: base.fullDescription,
    day: base.day,
    month: base.month,
    year: base.year,
    type: base.type,
    mediaUrl: base.mediaUrl,
    sport: base.sport,
    competition: {
      id: 100 + parsed.variant,
      name: "Mock Championship",
      slug: "mock-championship",
      level: CompetitionLevel.International,
    },
    location: {
      id: 200 + parsed.variant,
      name: "Mock Arena",
      city: "Tehran",
      country: "Iran",
      slug: "mock-arena",
    },
    participants: buildMockParticipants(base.id, parsed.variant),
  };

  return {
    sportEvent: detail,
  };
}

function buildMockParticipants(
  eventId: number,
  variant: 1 | 2 | 3,
): MockEventDetail["participants"] {
  if (variant === 3) {
    return [
      {
        id: eventId * 10 + 1,
        role: ParticipantRole.Winner,
        isPrimary: true,
        performanceNote: "Mock winner in fallback mode",
        person: null,
        team: mockTeams[0],
      },
      {
        id: eventId * 10 + 2,
        role: ParticipantRole.Loser,
        isPrimary: false,
        performanceNote: null,
        person: null,
        team: mockTeams[1],
      },
    ];
  }

  const person = mockPersons[(variant - 1) % mockPersons.length];

  return [
    {
      id: eventId * 10 + 1,
      role: variant === 1 ? ParticipantRole.Participant : ParticipantRole.Coach,
      isPrimary: true,
      performanceNote: "Mock participant for offline mode",
      person: {
        id: person.id,
        firstname: person.firstname,
        lastname: person.lastname,
        slug: person.slug,
      },
      team: null,
    },
  ];
}

function isDocument(
  left: TypedDocumentNode<any, any>,
  right: TypedDocumentNode<any, any>,
): boolean {
  return left === right;
}

export function getMockGraphqlData(
  document: TypedDocumentNode<any, any>,
  variables: unknown,
): unknown | null {
  if (isDocument(document, SportEventsPageDocument)) {
    return buildMockSportEventsPageData(variables as SportEventsPageQueryVariables);
  }

  if (isDocument(document, PersonsPageDocument)) {
    return buildMockPersonsData(variables as PersonsPageQueryVariables);
  }

  if (isDocument(document, SportEventDetailDocument)) {
    return buildMockSportEventDetailData(variables as SportEventDetailQueryVariables);
  }

  return null;
}
