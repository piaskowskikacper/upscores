export interface Match {
    _id: String;
    date: String;
    time: String;
    league: String;
    home_team: String;
    away_team: String;
    home_goals: String;
    away_goals: String;
    home_possession: Number;
    away_possession: Number;
    home_shots: Number;
    away_shots: Number;
    home_ontarget: Number;
    away_ontarget: Number;
    home_fouls: Number;
    away_fouls: Number;
    home_offsides: Number;
    away_offsides: Number;
    home_corners: Number;
    away_corners: Number;
    home_yellow_cards: Number;
    away_yellow_cards: Number;
    home_red_cards: Number;
    away_red_cards: Number;
}