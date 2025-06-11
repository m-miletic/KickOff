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
INSERT INTO tournaments (tournament_name, details, start_date, end_date) VALUES ('Seria B', 'details', now(), now());

INSERT INTO teams (team_name, representative_id) VALUES ('HNK Hajduk Split', 2);
INSERT INTO teams (team_name, representative_id) VALUES ('HNK Dinamo Zagreb', 3);
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');
INSERT INTO teams (team_name) VALUES ('Slaven Belupo');


INSERT INTO players (first_name, team_id) VALUES ('Marko', 1);
INSERT INTO players (first_name, team_id) VALUES ('Filip', 1);
INSERT INTO players (first_name, team_id) VALUES ('Niko', 1);
INSERT INTO players (first_name, team_id) VALUES ('Ivan', 1);
INSERT INTO players (first_name, team_id) VALUES ('Zvonimir', 1);
INSERT INTO players (first_name, team_id) VALUES ('Dario', 1);
INSERT INTO players (first_name, team_id) VALUES ('Ismael', 1);
INSERT INTO players (first_name, team_id) VALUES ('Dominik', 1);
INSERT INTO players (first_name, team_id) VALUES ('Bamba', 1);
INSERT INTO players (first_name, team_id) VALUES ('Josip', 1);

INSERT INTO matches (home_team_id, away_team_id, name, tournament_id, match_date) VALUES (1, 2, 'mec', 1, now());
INSERT INTO matches (home_team_id, away_team_id, name, tournament_id, match_date) VALUES (1, 3, 'mec', 1, now());


INSERT INTO team_tournament (team_id, tournament_id) VALUES (1, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (2, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (3, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (4, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (5, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (6, 1);
INSERT INTO team_tournament (team_id, tournament_id) VALUES (7, 1);

INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to represent a team', '2025-01-11 20:22:00', 2, 2, false, 'TEAM_REGISTRATION', 1);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to change role', '2023-01-11 20:22:00', 1, 2, false, 'ROLE_CHANGE', 1);

INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to host a tournament', '2025-01-11 20:22:00', 1, 7, false, 'TOURNAMENT_CREATION', 1);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to host a tournament', '2025-01-11 20:22:00', 2, 7, false, 'TOURNAMENT_CREATION', 1);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to host a tournament', '2025-01-11 20:22:00', 3, 7, false, 'TOURNAMENT_CREATION', 1);

INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to sign my team to tournament', '2024-01-11 20:22:00', 1, 2, false, 'TOURNAMENT_ENROLLMENT', 6);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to sign my team to tournament', '2024-01-11 20:22:00', 1, 2, false, 'TOURNAMENT_ENROLLMENT', 6);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to sign my team to tournament', '2024-01-11 20:22:00', 2, 2, false, 'TOURNAMENT_ENROLLMENT', 6);
INSERT INTO requests (message, time_created, status, requester_id, request_fulfilled, request_type, approver_id) VALUES ('I want to sign my team to tournament', '2024-01-11 20:22:00', 3, 2, false, 'TOURNAMENT_ENROLLMENT', 6);



