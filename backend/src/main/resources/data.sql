INSERT INTO users (email, role, password) VALUES ('admin@gmail.com', 'ADMIN', '$2a$12$ELqH2v2pyN1ifBoVW7p/4ODtPVUTC.BTRkPm9nbuYsSil4lpKUe86');
INSERT INTO users (email, role, password) VALUES ('team@gmail.com', 'TEAM_REPRESENTATIVE', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (email, role, password) VALUES ('user@gmail.com', 'USER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (email, role, password) VALUES ('organizer@gmail.com', 'TOURNAMENT_ORGANIZER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');
INSERT INTO users (email, role, password) VALUES ('organizer2@gmail.com', 'TOURNAMENT_ORGANIZER', '$2a$12$AXdcSiAlKsOUOYYRLwRAduG.cG1xxvXu.S7r/oa24XXNqgWjOssLG');

INSERT INTO tournaments (tournament_name, details, start_date, end_date, organizer_id) VALUES ('no name tournament', 'details', now(), now(), 4);
INSERT INTO tournaments (tournament_name, details, start_date, end_date, organizer_id) VALUES ('no name tournament2', 'details', now(), now(), 5);

