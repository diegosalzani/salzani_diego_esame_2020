<?php session_start(); include('header.php'); ?>
<link rel="stylesheet" href="https://cdn.metroui.org.ua/v4/css/metro-all.min.css">
<script src="https://cdn.metroui.org.ua/v4.3.2/js/metro.min.js"></script>  


<div class="pt-20-xl "></div>
    <div class=" p-5 mx-auto  bg-black fg-white border-radius-7  "style="width: 1220px">
        <div class="img-container rounded border bd-white border-size-3 ">
    <img src="images/direttore.png">
</div>
    <h1> SONDAGGIO SU ARTISTI E MUSICISTI
    <?php
       if($_SESSION['member_id']>=1){
           ?>
           <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='sondaggio1.php'" />
        <?php
        } 
        else{
               ?>
             <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='signup.php'" />
           <?php
           }
           ?>
    </h1>
    </div>
    <div class="pb-10-xl"></div>
    <div class=" p-5 mx-auto  bg-black fg-white border-radius-7  "style="width: 1220px">
        <div class="img-container rounded border bd-white border-size-3 ">
    <img src="images/social.png">
</div>
    <h1> SONDAGGIO SUI SOCIAL NETWORK
    <?php
       if($_SESSION['member_id']>=1){
           ?>
           <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='sondaggio2.php'" />
        <?php
        } 
        else{
               ?>
             <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='signup.php'" />
           <?php
           }
           ?> 
    </h1>
</div>
<div class="pb-10-xl"></div>
    <div class=" p-5 mx-auto  bg-black fg-white border-radius-7  "style="width: 1220px">
        <div class="img-container rounded border bd-white border-size-3 ">
    <img src="images/smart_working.png">
</div>
    <h1> SONDAGGIO SULLO SMART WORKING
    <?php

       if($_SESSION['member_id']>=1){
           ?>
           <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='sondaggio3.php'" />
        <?php
        } 
        else{
               ?>
             <input type="button" class="button primary large rounded place-right" value="Partecipa" onclick="window.location.href='signup.php'" />
           <?php
           }
           ?> 
    </h1>
</div>
<div class="p-5"></div>
       
