'use strict';

angular.module('calenshareApp')
.controller('MainCtrl', function ($scope, $rootScope, $http, ColorGenerator) {
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: $scope.alertEventOnClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
    }
  };

  $scope.calendars = [];

  $scope.toggleSidebar = function(){
    $rootScope.$broadcast('toggle-sidebar');
  };

  $scope.addUser = function(user) {
    if (typeof user === "string") {
      console.log('no user match.');
      return;
    }

    var color = ColorGenerator.generate(),
        calendar_id = user.local.calendarID;

    $scope.calendars.push({owner: user, color: color});

    $http.get('https://www.googleapis.com/calendar/v3/calendars/' +
              calendar_id +
              '/events?maxResults=2500&key=AIzaSyBQal2rNhP5SRkU5hZytY7Yb8nYc5Q1nrc').success(function(response){
      var events = response.items.map(function(event){
        return {
          id: event.id,
          title: event.summary || '忙碌',
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.start.date, // because end.date may be the next day, cause a '2-all-day' event, we use start.date here.
          allDay: !!event.start.date,
          color: color
        };
      });
      $scope.eventSources.push(events);
    });
  };

  $scope.eventSources = [];

  $http.get('/users').success(function(users){
    $scope.users = users;
  });

});
