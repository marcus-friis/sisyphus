export interface Boulder {
  id: number;
  name: string | null;
  gradeV: number;
  gradeFont: string | null;
  gymId: number | null;
  wallAngle: "slab" | "vertical" | "overhang" | "roof" | null;
  status: "project" | "sent" | "flashed";
  dateFirstTried: string | null;
  dateSent: string | null;
  notes: string | null;
}

export interface BoulderWithStats extends Boulder {
  totalAttempts: number;
  lastTriedDate: string | null;
}

export interface NewBoulderInput {
  name?: string;
  gradeV: number;
  gradeFont?: string;
  gymId?: number;
  wallAngle?: Boulder["wallAngle"];
  notes?: string;
}

export interface NewAttemptInput {
  date: string;
  attempts: number;
  result: "fell" | "sent" | "flash";
  notes?: string;
}

export interface Attempt {
  id: number;
  boulderId: number;
  date: string;
  attempts: number;
  result: "fell" | "sent" | "flash";
  notes: string | null;
}

export interface Media {
  id: number;
  boulderId: number;
  type: "photo" | "video";
  filePath: string;
  thumbnailPath: string | null;
  caption: string | null;
}
