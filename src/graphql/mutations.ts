import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        email
        firstname
        lastname
        role
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $firstname: String!
    $lastname: String!
    $password: String!
  ) {
    createUser(
      email: $email
      firstname: $firstname
      lastname: $lastname
      password: $password
    ) {
      id
      email
      firstname
      lastname
      role
    }
  }
`;

export const CREATE_LEAGUE = gql`
  mutation CreateLeague($name: String!, $private: Boolean!) {
    createLeague(name: $name, private: $private) {
      id
      name
      private
      shared_link
      active
    }
  }
`;

export const JOIN_LEAGUE = gql`
  mutation JoinLeague($leagueId: Int, $shared_link: String) {
    joinLeague(leagueId: $leagueId, shared_link: $shared_link) {
      id
      name
    }
  }
`;



export const UPDATE_BET_SELECTION = gql`
  mutation UpdateBetSelection(
    $betId: Int!
    $piloteP10Id: Int
    $piloteDNFId: Int
  ) {
    updateBetSelection(
      betId: $betId
      piloteP10Id: $piloteP10Id
      piloteDNFId: $piloteDNFId
    ) {
      id
      gp {
        id_api_races
      }
      pilote_p10 {
        id_api_pilotes
        name
      }
      pilote_dnf {
        id_api_pilotes
        name
      }
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($firstname: String, $lastname: String, $password: String) {
    updateUser(firstname: $firstname, lastname: $lastname, password: $password) {
      id
      firstname
      lastname
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation {
    deleteUser
  }
`;
export const CREATE_BET_SELECTION = gql`
  mutation CreateBetSelection($gpId: String!, $piloteP10Id: Int!, $piloteDNFId: Int!) {
    createBetSelection(gpId: $gpId, piloteP10Id: $piloteP10Id, piloteDNFId: $piloteDNFId) {
      id
      gp {
        id_api_races
        date
        time
        track {
          track_name
        }
      }
      pilote_p10 {
        name
      }
      pilote_dnf {
        name
      }
    }
  }
`;

export const DELETE_BET_SELECTION = gql`
  mutation DeleteBetSelection($betId: Int!) {
    deleteBetSelection(betId: $betId)
  }
`;
