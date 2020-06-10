<link rel="stylesheet" href="includes/styles/style.css" />
<?php 
error_reporting(0);
    include("header.php"); 
    include("includes/config.php"); 
    $errors='';
    $success='';
    session_start();
    $id_utente = $_SESSION['member_id'];
    $select = mysqli_query($connection, "SELECT * FROM risposte  where risposte.id_utente='$id_utente' and risposte.id_sondaggio=1");
    if(mysqli_num_rows($select)==1){
        $result = mysqli_fetch_array($select);
        $risposta1 = $result['risposta1'];
        $risposta2 = $result['risposta2'];
        $risposta3 = $result['risposta3'];
        if(!empty($_REQUEST['risposta1']) and !empty($_REQUEST['risposta2']) and !empty($_REQUEST['risposta3']) ){   
            $risposta1 = $_REQUEST['risposta1'];
            $risposta2 = $_REQUEST['risposta2'];
            $risposta3 = $_REQUEST['risposta3'];
            $update = "UPDATE risposte SET
                        risposta1='$risposta1',
                        risposta2='$risposta2',
                        risposta3='$risposta3'
                        where risposte.id_utente='$id_utente' and risposte.id_sondaggio=1
                        ";
            try{
                if(mysqli_query($connection, $update)){
                    $success .= "Risposte aggiornate";
                }
            }catch(Exception $e){
                echo($e);
            } 
        }
    }else{
        if(isset($_REQUEST['saveBtn'])){
            $risposta1 = $_REQUEST['risposta1'];
            $risposta2 = $_REQUEST['risposta2'];
            $risposta3 = $_REQUEST['risposta3'];
            if(!empty($risposta1) and  !empty($risposta2) and !empty($risposta3)  ){
                $query = "INSERT INTO risposte
                            SET
                            risposta1='$risposta1',
                            risposta2='$risposta2',
                            risposta3='$risposta3',
                            id_sondaggio=1,
                            id_utente='$id_utente'
                            ";
                try{
                    if(mysqli_query($connection, $query)){
                        $success .= "Risposte inviate correttamente";
                    }
                }catch(Exception $e){
                    echo($e);
                }
            }else{
                $errors .= 'Risposndere a tutte le domande';
            }  
        }
    }


    $select1 = mysqli_query($connection, "SELECT risposta1 FROM risposte where id_sondaggio=1");
    $result1 = mysqli_affected_rows($connection);

    $select1A = mysqli_query($connection, "SELECT risposta1 FROM risposte where risposta1 ='Franz Liszt'");
    $result1A = (mysqli_affected_rows($connection)*100)/$result1;

    $select1B = mysqli_query($connection, "SELECT risposta1 FROM risposte where risposta1 ='Fryderyk Chopin'");
    $result1B = (mysqli_affected_rows($connection)*100)/$result1;


    $select2 = mysqli_query($connection, "SELECT risposta2 FROM risposte where id_sondaggio=1");
    $result2 = mysqli_affected_rows($connection);

    $select2A = mysqli_query($connection, "SELECT risposta2 FROM risposte where risposta2 ='Luciano Pavarotti'");
    $result2A = (mysqli_affected_rows($connection)*100)/$result2;

    $select2B = mysqli_query($connection, "SELECT risposta2 FROM risposte where risposta2 ='Maria Callas'");
    $result2B = (mysqli_affected_rows($connection)*100)/$result2;


    $select3 = mysqli_query($connection, "SELECT risposta3 FROM risposte where id_sondaggio=1");
    $result3 = mysqli_affected_rows($connection);

    $select3A = mysqli_query($connection, "SELECT risposta3 FROM risposte where risposta3 ='Pablo Picasso'");
    $result3A = (mysqli_affected_rows($connection)*100)/$result3;

    $select3B = mysqli_query($connection, "SELECT risposta3 FROM risposte where risposta3 ='Giorgio de Chirico'");
    $result3B = (mysqli_affected_rows($connection)*100)/$result3;
?>



<link rel="stylesheet" href="https://cdn.metroui.org.ua/v4/css/metro-all.min.css">
<script src="https://cdn.metroui.org.ua/v4.3.2/js/metro.min.js"></script>  
<div class="pt-20-xl"></div>
<div class="w3-row w3-padding-64" id="about">
    <div  class=" p-5 mx-auto  bg-white  rounded border bd-black "style="width: 1000px">
    <fieldset class="customFormwrap bd-grayWhite text-center "><legend> <h1>Sondaggio su artisti e musicisti</h1></legend> 
    <form method="POST" action="" id="">
            <table width="100%" callpadding="0" cellpadding="0">
                <tr>    
                    <td width="50%">Quale pianista classico preferisci?<br></br></td> 
                    <td width="70%">
                        <input type="radio" name="risposta1"  value="Franz Liszt" <?=((isset($risposta1) and $risposta1=='Franz Liszt')?'checked':'')?>/>  Franz Liszt<div class="pb-1"></div>
                        <input type="radio" name="risposta1"  value="Fryderyk Chopin" <?=((isset($risposta1) and $risposta1=='Fryderyk Chopin')?'checked':'')?>/>  Fryderyk Chopin<div class="pb-5"></div>
                    </td>
                </tr>
                <tr class="place-center"> 
                    <td width="80%">Quale cantante lirico preferisci?</td>       
                    <td  width="80%">
                        <input type="radio" name="risposta2"  value="Luciano Pavarotti" <?=((isset($risposta2) and $risposta2=='Luciano Pavarotti')?'checked':'')?>/> Luciano Pavarotti<div class="pb-1"></div>
                        <input type="radio" name="risposta2"  value="Maria Callas" <?=((isset($risposta2) and $risposta2=='Maria Callas')?'checked':'')?>/> Maria Callas<div class="pb-5"></div>
                    </td>
                    </td>
                </tr>
                <td width="80%">Quale pittore surrealista preferisci?</td>       
                    <td  width="80%">
                        <input type="radio" name="risposta3"  value="Pablo Picasso" <?=((isset($risposta3) and $risposta3=='Pablo Picasso')?'checked':'')?>/>  Pablo Picasso<div class="pb-1"></div>
                        <input type="radio" name="risposta3"  value="Giorgio de Chirico" <?=((isset($risposta3) and $risposta3=='Giorgio de Chirico')?'checked':'')?>/>  Giorgio de Chirico<div class="pb-5"></div>
                    </td>
                    </td>
                </tr>
                    <td colspan="2">
                    <hr></hr> 
                    <div class="p-2"></div>
                        <input type="submit" value="Invia risposte" class="pos-bottom-center button primary rounded pos-bottom-center" name="saveBtn" />
                    </td>
                </tr>
            </table>
            <div class="pt-5-xl"></div>
    <?php echo $errors ?>
    <?php echo $success ?>                  
    </form>
</fieldset>
    </div>
    <div class="pt-20-xl"></div>
    <div class=" p-5 mx-auto  bg-white fg-white rounded border bd-black "style="width: 1000px">
      <h1 class="fg-black text-center ">RISPOSTE DEI NOSTRI UTENTI</h1>
      <table class="table table-border cell-border pr-20">
  <tr>
    <th>Domanda</th>
    <th>Risposte</th>
  </tr>
  <tr>
    <td>Quale pianista classico preferisci?</td>
    <td>Franz Liszt <?php echo round($result1A,2) .'%' ?></td>
    <td>Fryderyk Chopin <?php echo round($result1B,2) .'%' ?></td>
  </tr>
  <tr>
    <td>Quale cantante lirico preferisci?</td>
    <td>Luciano Pavarotti <?php echo round($result2A,2) .'%' ?></td>
    <td>Maria Callas <?php echo round($result2B,2) .'%' ?></td>
  </tr>
  <tr>
    <td>Quale pittore surrealista preferisci?</td>
    <td>Pablo Picasso <?php echo round($result3A,2) .'%' ?></td>
    <td>Giorgio de Chirico <?php echo round($result3B,2) .'%' ?></td>
  </tr>
 
</table>
    </div>
  </div>
  <div class="pt-10-xl"></div>

