angular.module('plunker', ['ui.bootstrap']);

function DialogDemoCtrl($scope, $timeout, $dialog){
  $timeout(function(){
    $dialog.dialog({}).open('modalContent.html');  
  }, 3000);  
}

