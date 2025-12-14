import type { Control } from "../types/control";

export const mockControls: Control[] = [
  {
    id: "control-001",
    isoId: "A.5.1.1",
    title: "Policies for information security",
    description:
      "Policies skal dokumenteres, godkjennes av ledelsen, publiseres og kommuniseres til alle ansatte og relevante eksterne parter.",
    status: "Implemented",
    justification:
      "Fullstendig implementert med dokumenterte policies og kommunikasjonsprosesser.",
    owner: "CISO",
  },
  {
    id: "control-002",
    isoId: "A.5.1.2",
    title: "Review of the policies for information security",
    description:
      "Policies skal gjennomgås med jevne mellomrom eller ved betydelige endringer.",
    status: "Implemented",
    justification: "Årlig gjennomgang er etablert og dokumentert.",
    owner: "CISO",
  },
  {
    id: "control-003",
    isoId: "A.6.1.1",
    title: "Information security roles and responsibilities",
    description:
      "Roller og ansvar skal defineres og tildeles i henhold til policy.",
    status: "Planned",
    justification:
      "Roller er definert, men ikke fullt formelt tildelt.",
    owner: "HR",
  },
  {
    id: "control-004",
    isoId: "A.6.1.2",
    title: "Segregation of duties",
    description:
      "Konflikterende oppgaver og ansvar skal identifiseres og separeres.",
    status: "Planned",
  },
  {
    id: "control-005",
    isoId: "A.7.1.1",
    title: "Screening",
    description:
      "Screening av kandidater i henhold til lover og risikonivå.",
    status: "NotRelevant",
  },
];
