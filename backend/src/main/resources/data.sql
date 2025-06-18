INSERT INTO users (username, role, password) VALUES ('admin@gmail.com', 'ADMIN', '$2a$12$ELqH2v2pyN1ifBoVW7p/4ODtPVUTC.BTRkPm9nbuYsSil4lpKUe86');
INSERT INTO users (username, role, password) VALUES ('team@gmail.com', 'TEAM_REPRESENTATIVE', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('team2@gmail.com', 'TEAM_REPRESENTATIVE', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('team3@gmail.com', 'TEAM_REPRESENTATIVE', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('user@gmail.com', 'USER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('organizer@gmail.com', 'TOURNAMENT_ORGANIZER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('organizer2@gmail.com', 'TOURNAMENT_ORGANIZER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (username, role, password) VALUES ('organizer3@gmail.com', 'TOURNAMENT_ORGANIZER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');


INSERT INTO tournaments (tournament_name, details, start_date, end_date, organizer_id) VALUES ('Seria A', 'details', now(), now(), 6);
INSERT INTO tournaments (tournament_name, details, start_date, end_date, organizer_id) VALUES ('Liga Veterana', 'details', now(), now(), 7);
INSERT INTO tournaments (tournament_name, details, start_date, end_date, organizer_id) VALUES ('Seria B', 'details', now(), now(), 8);

INSERT INTO teams (team_name, representative_id) VALUES ('HNK Hajduk Split', 2);
INSERT INTO teams (team_name, representative_id) VALUES ('HNK Dinamo Zagreb', 3);
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');
INSERT INTO teams (team_name) VALUES ('Istra');
INSERT INTO teams (team_name) VALUES ('Osijek');
INSERT INTO teams (team_name) VALUES ('Rijeka');
INSERT INTO teams (team_name) VALUES ('Vukovar');




INSERT INTO team_tournament (team_id, tournament_id) VALUES (1, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (2, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (3, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (4, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (5, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (6, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (7, 1);





INSERT INTO stadiums (stadium_name, location) VALUES ('Poljud', 'Split Ulica 123');
INSERT INTO stadiums (stadium_name, location) VALUES ('Maksimir', 'Zagreb Ulica 1111');
INSERT INTO stadiums (stadium_name, location) VALUES ('Rujevica', 'Rijeka Ulica 000');
INSERT INTO stadiums (stadium_name, location) VALUES ('Opus Arena', 'Osijek Ulica 000');



INSERT INTO matches (match_date, home_team_id, away_team_id, name, tournament_id, stadium_id, home_team_goals, away_team_goals) VALUES ('2025-06-14 17:00:00', 1, 2, 'Hajduk VS Dinamo', 1, 1, 2, 0);
INSERT INTO matches (match_date, home_team_id, away_team_id, name, tournament_id, stadium_id, home_team_goals, away_team_goals) VALUES ('2025-06-14 17:00:00', 1, 3, 'Hajduk VS Dinamo', 1, 1, 2, 2);
INSERT INTO matches (match_date, home_team_id, away_team_id, name, tournament_id, stadium_id, home_team_goals, away_team_goals) VALUES ('2025-06-14 17:00:00', 1, 4, 'Hajduk VS Dinamo', 1, 1, 0, 2);
INSERT INTO matches (match_date, home_team_id, away_team_id, name, tournament_id, stadium_id, home_team_goals, away_team_goals) VALUES ('2025-06-14 17:00:00', 1, 4, 'Hajduk VS Dinamo', 1, 1, 4, 2);


