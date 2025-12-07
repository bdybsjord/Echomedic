import type {
  Risk as DomainRisk,
  RiskStatus as DomainRiskStatus,
} from "../types/risk";
import type {
  Risk as MockRisk,
  RiskStatus as MockRiskStatus,
} from "../data/mockRisks";

function mapMockStatusToDomain(status: MockRiskStatus): DomainRiskStatus {
  switch (status) {
    case "Åpen":
      return "Open";
    case "Under behandling":
      return "InProgress";
    case "Lukket":
    default:
      return "Closed";
  }
}

export function mapMockRiskToDomain(mock: MockRisk): DomainRisk {
  return {
    id: mock.id,
    title: mock.name,
    description: mock.description,
    likelihood: mock.likelihood,
    consequence: mock.impact,
    score: mock.likelihood * mock.impact,
    level: mock.level, // High | Medium | Low 
    status: mapMockStatusToDomain(mock.status),
    owner: mock.owner,
    measures: mock.mitigation,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function mapMockRisksToDomain(mocks: MockRisk[]): DomainRisk[] {
  return mocks.map(mapMockRiskToDomain);
}
