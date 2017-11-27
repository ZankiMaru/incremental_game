describe('Main Controller Test', function () {
    
    var $controller, $rootScope, $scope, $interval, $route, $location;
    var userService, ModelInterval, GridLocation, buildingFactory
    var controller;

    beforeEach(function(){
        // Load Module
        module('myApp');

        // Inject services and dependencies
        inject(function(_$controller_, _$rootScope_, $injector, _$interval_, _$location_, _$route_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
            $location = _$location_;
            $route = _$route_;            
            userService = $injector.get('userService');
            ModelInterval = $injector.get('ModelInterval');
            GridLocation = $injector.get('GridLocation');
            buildingFactory = $injector.get('buildingFactory');
         
            // Set path
            expect($route.current).toBeUndefined();
            $location.path('/');
            $rootScope.$digest();
        });

        // Set scope and controller with its dependencies
        $scope = $rootScope.$new();        
        controller = $controller('mainController', {
            $scope: $scope,
            userService: userService,
            ModelInterval: ModelInterval,
            GridLocation: GridLocation,
            buildingFactory: buildingFactory
        });
    });        

    it('test1', function() {    
        expect($scope.testVar).toBe(0);
    });
    
});
