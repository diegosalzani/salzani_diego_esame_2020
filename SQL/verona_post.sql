-- La seguente query visualizza lo
-- username di tutti gli utenti che al
-- sondaggio su artisti e musicisti nella prima 
-- domanda hanno risposto “Franz Liszt”. 

SELECT username, risposta1 
FROM risposte 
JOIN utenti U on U.id=risposte.id_utente 
JOIN sondaggio S on S.id_sondaggio=risposte.id_sondaggio
WHERE risposte.id_sondaggio=1 
AND risposte.risposta1="Franz Liszt"

-- La seguente query SQL ci restituisce 
-- lo username degli utenti che hanno dichiarato 
-- di lavorare meglio in smart working al mattino ed 
-- utilizzano più frequentemente Facebook. La 
-- particolarità di questa interrogazione è il
-- fatto che vada a cercare due valori comuni ad
-- uno stesso username presenti però in record differenti. 
-- Con “HAVING COUNT(*)=2” andremo ad scartare gli 
-- utenti che rispettano uno solo dei due requisiti richiesti.


SELECT username
FROM risposte 
JOIN utenti U on U.id=risposte.id_utente 
JOIN sondaggio S on S.id_sondaggio=risposte.id_sondaggio
WHERE risposte.risposta3="Mattina"
OR risposte.risposta1="Facebook"
GROUP BY username
HAVING count(*)=2
