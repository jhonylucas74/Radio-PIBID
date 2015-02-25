var app = angular.module('starter', ['ionic','ngFx']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller("Stream",function($scope,$timeout){
  $scope.play = true;
  $scope.loading = false;
  $scope.stop = false;

  $scope.volume = 50;


  document.getElementById("loading").style.display = 'none';
  document.getElementById("stop").style.display = 'none';

  $scope.change_status = function(){

    if( $scope.play == true){
      $scope.play = false;
      $scope.loading = true;

      document.getElementById("play").style.display = 'none';
      document.getElementById("loading").style.display = 'block';
      document.getElementById("message").innerHTML = "Carregando stream..";
      playAudio();
    }

    if( $scope.stop == true){
      $scope.stop = false;
      $scope.play = true;
      document.getElementById("stop").style.display = 'none';
      document.getElementById("play").style.display = 'block';
      document.getElementById("message").innerHTML = "Toque no botão play <br> para ouvir a rádio.";
      stopAudio();
    }
  };

  function endLoading(){
    $scope.loading = false;
    $scope.stop = true;
    document.getElementById("loading").style.display = 'none';
    document.getElementById("stop").style.display = 'block';
  }

  var my_media = null;
  var mediaTimer = null;

  function setVolume(){
    if (my_media != null) { 
      my_media.setVolume($scope.volume / 100);
    }    
  }

  $scope.changeVolume = function(){
    setVolume();
  }

  function playAudio(){
    my_media = new Media("http://50.22.218.101:11232/;", onSuccess, onError);
    my_media.play();
    setVolume();

    if(mediaTimer == null){
      // Update media position every second
      mediaTimer = setInterval(function () {
        // get media position
        my_media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > -1 && position != -0.001) {
                    if($scope.loading == true ){
                      endLoading();
                    }
                    document.getElementById("message").innerHTML = (position) + " sec";
                }
            },
            // error callback
            function (e) {
                console.log("Error getting pos=" + e);
            }
        );
      }, 1000);
    }

  }

  function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
  }


  function onSuccess(){ }

  function onError(){
    document.getElementById("message").innerHTML = "Desculpe ocorreu um erro!<br> Tente novamente ^-^"
  }

  


});
