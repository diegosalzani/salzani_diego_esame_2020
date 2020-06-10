
<?php 
    include("includes/config.php"); 
    session_start();
    $errors='';
    $success='';
    if(isset($_POST['registerBtn'])){
        $username = $_REQUEST['username'];
        $email = $_REQUEST['email'];
        $password = $_REQUEST['password'];
        if( empty($username) or empty($email) or empty($password)){
            $errors .= 'Non lasciare campi vuoti!';
        }else{
            $select = mysqli_query($connection, "SELECT * FROM utenti WHERE email='$email'");
            $select1 = mysqli_query($connection, "SELECT * FROM utenti WHERE username='$username'");
            if(mysqli_num_rows($select)>=1 or mysqli_num_rows($select1)>=1){
                $errors .= 'Utente già registrato';
            }else{
                $query = "INSERT INTO utenti SET
                            id='',
                            username='$username',
                            email='$email',
                            password='$password',
                            data_iscrizione=NOW()
                            ";


                if( mysqli_query($connection, $query)){
                $success .= 'Registrazione completata!';
                $select = mysqli_query($connection, "SELECT * FROM utenti WHERE email='$email' and password='$password'");
                $result = mysqli_fetch_array($select);
                $_SESSION['member_id'] = $result['id'];
                header("Location: index.php");
                }
            }
        }
    }
?>


<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdn.metroui.org.ua/v4/css/metro-all.min.css">
<script src="https://cdn.metroui.org.ua/v4.3.2/js/metro.min.js"></script>
</head>
<body>
<div class="container">
    <div class="pos-fixed pos-center border bd-black border-radius-7" style="width: 400px;">
        <h1 class="text-center    border-radius fg-black pb-3">Verona POST</h1>
        <h6 class="text-center"><?php echo $errors ?></h6>
        <h6 class="text-center"><?php echo $success ?></h6>
            <div class="pos-top-center" style="width: 300px;">
                <form method="POST" action="" id="">
                    <input type="text" name="username" class="fields" placeholder="Username" value="<?=((isset($username) )?$username:'')?>"/>
                        <br>
                        <input type="email" name="email" class="fields" placeholder="e-mail" value="<?=((isset($email) )?$email:'')?>"/>
                        <br>
                        <input type="password" name="password" class="fields" placeholder="Password" value="<?=((isset($password) )?$password:'')?>"/>
                        <br>
                        <input type="submit" value="Iscriviti" class="button primary rounded pos-bottom-center"name="registerBtn" />
                </div>
                <div class="pos-bottom-center" style="width: 300px;">
                </div >
                <h6 class="text-center">Sei gia registrato? <a href="login.php">Accedi</a></h6>
                </form>
        </div>
    </div>
</body>
</html>