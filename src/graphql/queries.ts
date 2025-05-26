import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    getMe {
      id
      email
      firstname
      lastname
      role
      id_avatar
      avatar {
        id
        picture_avatar
      }
    }
  }
`;

export const GET_NEXT_GP = gql`
  query GetNextGP {
    getNextGP {
      id_api_races
      season
      date
      time
      track {
        id_api_tracks
        country_name
        track_name
        picture_country
        picture_track
      }
    }
  }
`;

export const GET_UPCOMING_GPS = gql`
  query GetUpcomingGPs {
  getUpcomingGPs {
    id_api_races
    season
    date
    time
    track {
      id_api_tracks
      country_name
      track_name
      picture_country
      picture_track
    }
  }
}
`;

export const GET_MY_LEAGUES = gql`
  query GetMyLeagues {
    getMyLeagues {
      id
      name
      private
      shared_link
      active
      id_avatar
      avatar {
        id
        picture_avatar
      }
    }
  }
`;

export const GET_PUBLIC_LEAGUES = gql`
  query GetPublicLeagues {
    getPublicLeagues {
      id
      name
      private
      active
    }
  }
`;

export const GET_MY_BETS = gql`
  query GetMyBets {
    getMyBets {
      id
      points_p10
      points_dnf
      gp {
        id_api_races
        season
        date
        time
        track {
          id_api_tracks
          country_name
          track_name
          picture_country
          picture_track
        }
      }
      pilote_p10 {
        id_api_pilotes
        name
        picture
        name_acronym
      }
      pilote_dnf {
        id_api_pilotes
        name
        picture
        name_acronym
      }
    }
  }
`;

export const GET_PILOTES = gql`
  query GetPilotes {
    pilotes {
      id_api_pilotes
      name
      picture
      name_acronym
    }
  }
`;

export const GET_LEAGUE_USERS = gql`
  query GetLeagueUsers($leagueId: Int!) {
    getLeagueUsers(leagueId: $leagueId) {
      id
      firstname
      lastname
      email
      role
    }
  }
`;
export const GET_ALL_GPS = gql`
  query GetAllGPs {
    getAllGPs {
      id_api_races
      season
      date
      time
      track {
        id_api_tracks
        country_name
        track_name
        picture_country
        picture_track
      }
    }
  }
`;

export const GET_PAST_GPS = gql`
  query GetPastGPs {
    getPastGPs {
      id_api_races
      season
      date
      time
      track {
        id_api_tracks
        country_name
        track_name
        picture_country
        picture_track
      }
    }
  }
`;export const GET_GP_CLASSEMENT = gql`
query GetClassementByGP($gpId: String!) {
  getClassementByGP(gpId: $gpId) {
    position
    isDNF
    pilote {
      id_api_pilotes
      name
      picture
      name_acronym
    }
    ecurie {
      id_api_ecuries
      name
      logo
      color
    }
  }
}
`;

export const GET_LIGUE_CLASSEMENT = gql`
query ClassementLigue($leagueId: ID!) {
  classementLigue(leagueId: $leagueId) {
    totalPoints
    user {
      id
      firstname
      lastname
      email
      avatar {
        picture_avatar
      }
    }
  }
}
`;