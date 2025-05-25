export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  id_avatar?: number;
  avatar?: Avatar;
}

export interface Avatar {
  id: number;
  picture_avatar: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface League {
  id: number;
  name: string;
  private: boolean;
  shared_link?: string;
  active: boolean;
  id_avatar?: number;
  avatar?: Avatar;
}

export interface UserLeague {
  id: number;
  league: League;
  user: User;
  role: string;
}

export interface Track {
  id_api_tracks: number;
  country_name: string;
  track_name: string;
  picture_country?: string;
  picture_track?: string;
}

export interface Pilote {
  id_api_pilotes: number;
  name: string;
  picture?: string;
  name_acronym?: string;
}

export interface Ecurie {
  id_api_ecuries: number;
  name: string;
  logo?: string;
  color?: string;
}

export interface PiloteEcurie {
  id: number;
  pilote: Pilote;
  ecurie: Ecurie;
  year: string;
}

export interface GP {
  id_api_races: string;
  season: string;
  date: string;
  time: string | number;  // Accepte les deux formats
  track: Track;
}

export interface GPPilote {
  id: number;
  gp: GP;
  pilote: Pilote;
  ecurie: Ecurie;
}

export interface GPClassement {
  id: number;
  gp: GP;
  gp_pilote: GPPilote;
  isDNF: boolean;
  position: number;
}

export interface BetSelectionResult {
  id: number;
  points_p10?: string;
  points_dnf?: string;
  gp: GP;
  pilote_p10: Pilote;
  pilote_dnf: Pilote;
  user: User;
}

export interface ClassementResult {
  position: number;
  isDNF: boolean;
  pilote: Pilote;
  ecurie: Ecurie;
}