--
-- Dump dei dati per la tabella `risposte`
--

INSERT INTO `risposte` (`id_utente`, `id_sondaggio`, `risposta1`, `risposta2`, `risposta3`) VALUES
(1, 1, 'Fryderyk Chopin', 'Luciano Pavarotti', 'Giorgio de Chirico'),
(1, 2, 'Facebook', 'Meno di due ore', 'No'),
(1, 3, 'Raramente', 'Computer portatile', 'Mattina'),
(2, 3, 'Spesso', 'Computer portatile', 'Mattina'),
(3, 1, 'Franz Liszt', 'Luciano Pavarotti', 'Giorgio de Chirico'),
(3, 2, 'Facebook', 'Più di due ore', 'No');

-- --------------------------------------------------------


--
-- Dump dei dati per la tabella `sondaggio`
--

INSERT INTO `sondaggio` (`id_sondaggio`, `nome_sondaggio`) VALUES
(1, 'artisti'),
(2, 'social_network'),
(3, 'smart_working');

-- --------------------------------------------------------


--
-- Dump dei dati per la tabella `utenti`
--

INSERT INTO `utenti` (`id`, `username`, `email`, `password`, `data_iscrizione`) VALUES
(1, 'diegosalzani', 'diegosalzani2001@gmail.com', '1234', '2020-03-26'),
(2, 'marco_verdi', 'marco03@hotmail.it', 'ciao34', '2020-06-01'),
(3, 'margherita_bianchi', 'marghe2334@live.it', 'estate45', '2020-05-12');
