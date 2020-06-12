
-- Database: `verona_post`

CREATE DATABASE verona_post;
USE verona_post;


-- Struttura della tabella `risposte`

CREATE TABLE `risposte` (
  `id_utente` int(11) NOT NULL,
  `id_sondaggio` int(11) NOT NULL,
  `risposta1` varchar(220) NOT NULL,
  `risposta2` varchar(220) NOT NULL,
  `risposta3` varchar(220) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Struttura della tabella `sondaggio`

CREATE TABLE `sondaggio` (
  `id_sondaggio` int(11) NOT NULL,
  `nome_sondaggio` varchar(220) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Struttura della tabella `utenti`

CREATE TABLE `utenti` (
  `id` int(11) NOT NULL,
  `username` varchar(220) NOT NULL,
  `email` varchar(220) NOT NULL,
  `password` varchar(220) NOT NULL,
  `data_iscrizione` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- Indici per la tabella `risposte`

ALTER TABLE `risposte`
  ADD KEY `id_utente` (`id_utente`),
  ADD KEY `id_sondaggio` (`id_sondaggio`);


-- Indici per la tabella `sondaggio`

ALTER TABLE `sondaggio`
  ADD PRIMARY KEY (`id_sondaggio`);


-- Indici per la tabella `utenti`

ALTER TABLE `utenti`
  ADD PRIMARY KEY (`id`);




-- AUTO_INCREMENT per la tabella `sondaggio`

ALTER TABLE `sondaggio`
  MODIFY `id_sondaggio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


-- AUTO_INCREMENT per la tabella `utenti`

ALTER TABLE `utenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;



-- Limiti per la tabella `risposte`

ALTER TABLE `risposte`
  ADD CONSTRAINT `risposte_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `risposte_ibfk_2` FOREIGN KEY (`id_sondaggio`) REFERENCES `sondaggio` (`id_sondaggio`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

