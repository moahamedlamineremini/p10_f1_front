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
  query GetGPs($season: String) {
    gps(season: $season) {
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