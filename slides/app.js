function slideLoadFailedHtml(id) {
   return('This slide failed to load. Tap <a href="#" onclick=\'javascript:reloadSlide("'+id+'"); return false;\'>here</a> to try reloading this slide. If the problem persists, please contact your teacher.');
}
function reloadSlide(id) {
  if (id.split('.').length == 1) {
      steps[0] = steps[0]+".html";
  }
    /*
  $http({
    method: 'GET',
    url: "./slides/"+id+"?update"
  }).then(function success(response) {
      console.log(response);
      $("#"+id).html(response.body);
  }, function error(response) {
      console.error(response);
  });
  */
  $.ajax({
    method: 'GET',
    url: "./slides/"+id+"?update",
    dataType: "html",
    success: function(response) {
      console.log(response);
      $("[id*='"+id+"']").html(response);
    },
  });
}
function init_reveal(deck) {
  Reveal.initialize({
    math: {
      //mathjax: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
      mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
      config: 'TeX-AMS_HTML-full', // See http://docs.mathjax.org/en/latest/config-files.html
      // pass other options into `MathJax.Hub.Config()`
      TeX: { Macros: { RR: "{\\bf R}" } },
      tex2jax: {
        //inlineMath: [ ["\\(","\\)"] ],
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true
      },
    },
    broadcast: {
      secret: '$2a$05$hhgakVn1DWBfgfSwMihABeYToIBEiQGJ.ONa.HWEiNGNI6mxFCy8S',
      // Configure RTCMultiConnection
      connection: {
        socketURL: 'https://revealjs-broadcast.herokuapp.com/',
        session: {
        audio: true,
        video: true,
        oneway: true
        },
      },
    }, 
    countdown: { defaultTime: 300, autostart: "yes" },
    keyboard: {
      8: function() { RevealChalkboard.reset() },    // reset chalkboard data on current slide when 'BACKSPACE' is pressed
      67: function() { RevealChalkboard.toggleNotesCanvas() },    // toggle notes canvas when 'c' is pressed
      68: function() { RevealChalkboard.download() }, // downlad recorded chalkboard drawing when 'd' is pressed
      82: function() { Recorder.toggleRecording(); }, // press 'r' to start/stop recording
      90: function() { Recorder.downloadZip(); },     // press 'z' to download zip containing audio files
    },
    anything: [ 
      {
        className: "question", 
      }
    ],
    chalkboard: {
        src: './slides/'+deck+'/chalkboard.json',
        readOnly: false,
    },
	audio: {
      prefix: './slides/'+deck+'/audio/',
      suffix: '.webm',
      advance: 0,
      playerStyle: 'position: fixed; top: 4px; left: 25%; width: 50%; height:75px; z-index: 33;',
      playerOpacity: 0.25,
    },
    dependencies: [
      { src: './reveal.js/plugin/math/math.js', async: true },
      { src: './reveal.js-plugins/anything/anything.js' },
      { src: './reveal.js/plugin/markdown/marked.js' },
      { src: './reveal.js/plugin/markdown/markdown.js' },
      { src: './reveal_countdown/countdown.js' },
      // audio recording
  	  { src: './reveal.js-plugins/audio-slideshow/RecordRTC.js', condition: function( ) { return !!document.body.classList; } },				
  	  { src: './reveal.js-plugins/audio-slideshow/slideshow-recorder.js', condition: function( ) { return !!document.body.classList; } },				
  	  { src: './reveal.js-plugins/audio-slideshow/audio-slideshow.js', condition: function( ) { return !!document.body.classList; } },
      // chalkboard
      //{ src: './reveal.js-plugins/chalkboard/chalkboard.js', condition: function( ) { return !!document.body.classList; } },
      // broadcasting audio/video
      /*
      { src: './reveal.js-plugins/broadcast/RTCMultiConnection.min.js'},
      { src: './reveal.js-plugins/broadcast/socket.io.js'},
      { src: './reveal.js-plugins/broadcast/bCrypt.js'},
      { src: './reveal.js-plugins/broadcast/broadcast.js'},
      { src: './reveal.js/plugin/highlight/highlight.js' },
      { src: '/static/js/reveal.js/plugin/notes/notes.js', async: true },
      */
    ],
    hash: true,
    loop: false,
    //transition: Reveal.getQueryHash().transition || 'none',
  });
}
var app = angular.module('slides', [
    'angularLoad',
    'btford.socket-io',
    'services.sockets',
    'slides.services.chatdata',
    'ngRoute',
]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/#:deck', {
            templateUrl: 'index.html',
            controller: 'MyController'
            });
}]);
app.config(['$provide', function ($provide) {
    $provide.decorator('$browser', ['$delegate', '$window', function ($delegate, $window) {
        // normal anchors
        let ignoredPattern = /^#[a-zA-Z0-9%2F\/\?].*/;
        let originalOnUrlChange = $delegate.onUrlChange;
        $delegate.onUrlChange = function (...args) {
            if (ignoredPattern.test($window.location.hash)) return;
            originalOnUrlChange.apply($delegate, args);
        };
        let originalUrl = $delegate.url;
        $delegate.url = function (...args) {
            if (ignoredPattern.test($window.location.hash)) return $window.location.href;
            return originalUrl.apply($delegate, args);
        };
        return $delegate;
    }]);
}]);
/*
app.config( ['$provide', function ($provide){
        $provide.decorator('$browser', ['$delegate', function ($delegate) {
            $delegate.onUrlChange = function () {};
            $delegate.url = function () { return ""};
            return $delegate;
        }]);
    }]);
*/
/*
  app.directive('contentDirective', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });
  */
app.directive("myInclude", function() {
  return {
    restrict: 'CAE',
    scope: {
      src: '=',
      myInclude: '='
    },
    transclude:true,
    link: function(scope, iElement, iAttrs, controller) {
      scope.$on("$includeContentError", function(event, args){
        scope.loadFailed=true;
       });
      scope.$on("$includeContentLoaded", function(event, args){
        scope.loadFailed=false;
      });
    },
    template: "<div ng-include='myInclude||src'></div><div ng-show='loadFailed' ng-transclude/>"
  };
})
/*
app.config([ '$httpProvider' , function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true ;
  delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
}]);
*/
app.directive('slideshow', ['$compile', 'Sockets', function($compile, Sockets) {
  return {
      /*
    scope: {
      slides: '=slides'
    },
    */
      controller: ["$scope", "$location", "$http", "$routeParams", function($scope, $location, $http, $routeParams) {
      $scope.slides = [];
      //hash_parts = $location.hash().split("/");
      //return ( /print-pdf/gi ).test( window.location.search );
      hash_parts = window.location.hash.substr(1).split("%2F");
      deck = hash_parts[0] ? hash_parts[0] : hash_parts[1];
      console.log(deck);
      $http({
        method: 'GET',
        url: "./decks/"+deck+".json?raw=true"
      }).then(function success(response) {
          console.log(response);
          if (typeof(response.data.collection) !== 'undefined') {
            $scope.collection = response.data.collection
            $scope.slides = response.data.slides;
          } else {
            $scope.slides = response.data;
          }
          console.log($scope.slides);
      }, function error(response) {
          console.error(response);
      });
    }],
    link: function(scope, elem, attrs) {
      // the following is handled by the snow-qm-task directive for now
      /*
      Sockets.on('output', function(data) {
          console.log("output received");
          output(data);
      });
      */
      elem.addClass('slides');
      scope.$watch('slides', function(slides) {
        console.log(slides);
        if (slides.length) {
          console.log("updating slides");
          for (var i = 0; i < scope.slides.length; i++) {
            var section = angular.element("<section>");
            var steps = scope.slides[i];
    
            if (steps.length == 1) {
              if (typeof(scope.collection) !== 'undefined') {
                  steps[0] = scope.collection+"/"+steps[0];
              }
              if (steps[0].split('.').length == 1) {
                  steps[0] = steps[0]+".html";
              }
              if (steps[0].split('.').pop() === "md") {
                console.log("slide "+steps[0]+" has markdown");
                section.attr("id", steps[0]);
                section.attr("data-markdown", '');
                section.attr("data-separator", '^---$');
                div = angular.element("<div>");
                div.attr('my-include', "'./slides/"+steps[0]+"'");
                div.html(slideLoadFailedHtml(steps[0]));
                  /*
                section.attr("id", steps[0]);
                section.attr("data-markdown", '');
                section.attr("data-separator", '^---$');
                script = angular.element("<script>");
                script.attr('type', 'text/template');
                script.attr('my-include', "'./slides/"+steps[0]+"'");
                section.append(script);
                */
                section.append(div);
              } else {
                section.attr('my-include', "'./slides/"+steps[0]+"'");
                section.attr("id", steps[0]);
                section.html(slideLoadFailedHtml(steps[0]));
              }
                  /*
              section.attr('ng-include', "'./slides/"+steps[0]+".html?raw=true'");
              section.attr("id", steps[0]);
              section.attr("data-markdown", '');
              section.attr("data-separator", '^---$');
              */
              $compile(section)(scope);
            } else {
              console.log(steps.length);
              for (var j = 0; j < steps.length; j++) {
                var subSection = angular.element("<section>");
                if (typeof(scope.collection) !== 'undefined') {
                    steps[j] = scope.collection+"/"+steps[j];
                }
                if (steps[j].split('.').length == 1) {
                    steps[j] = steps[j]+".html";
                }
                if (steps[j].split('.').pop() === "md") {
                  console.log("slide "+steps[j]+" has markdown");
                  subSection.attr("id", steps[j]);
                  subSection.attr("data-markdown", '');
                  subSection.attr("data-separator", '^---$');
                  div = angular.element("<div>");
                  div.attr('my-include', "'./slides/"+steps[j]+"'");
                  div.html(slideLoadFailedHtml(steps[0]));
                  /*
                  script = angular.element("<script>");
                  script.attr('type', 'text/template');
                  script.attr('ng-include', "'./slides/"+steps[j]+"'");
                  */
                  //subSection.append(script);
                  //div.append(script);
                  subSection.append(div);
                } else {
                  console.log("slide "+steps[j]+" has html");
                  subSection.attr('my-include', "'./slides/"+steps[j]+"'");
                  subSection.html(slideLoadFailedHtml(steps[0]));
                  subSection.attr("id", steps[j]);
                }
                //if (j < steps.length - 1)
                //  subSection.attr('data-autoslide', '1000');
                  /*
                subSection.attr("data-markdown", '');
                subSection.attr("data-separator", '^---$');
                subSection.attr("ng-include", "'./slides/"+steps[j]+".html?raw=true'");
                subSection.attr("id", steps[j]);
                */
                section.append(subSection);
              }
              $compile(section)(scope);
            }
            elem.append(section);
          }
          //$compile(elem)(scope);
          if(Reveal.isReady()) {
            Reveal.sync();
          } else {
            init_reveal(deck);
          }
        }
      });
    }
  };
}]);

app.controller("myctrl", ["$scope", "$location", "$http", "$routeParams","Sockets","angularLoad", function($scope, $location, $http, $routeParams, Sockets, angularLoad) {
      Sockets.on('snow_qm_task_data', function (data) {
        console.log(data);
        Promise.all(data.question.scripts.map(function(script) { 
            return angularLoad.loadScript(script).then(function(result) { 
                return result;
            });
        })).then(function(results) {
          // results is an array of names
          $('#snow_qm_'+data['collection']+'_'+data['task']).html(data.html)
          $('#snow_qm_'+data['collection']+'_'+data['task']).find('form').submit(function (e) {
            Sockets.emit('form_submit', data=getFormData( $(this) ));   
            e.preventDefault(); // block the traditional submission of the form.
          });
        });
      });
      Sockets.on('output', function(data) {
          console.log("output received");
          mark(data);
      });
}]);
