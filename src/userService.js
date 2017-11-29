var app = angular.module('myApp');

app.factory('userService', ['$rootScope', '$interval', 'buildingFactory', function ($rootScope, $interval, buildingFactory) {
    var service = {
        // Store how much points user have
        model: {
            zenny: 0,
            sim: 2,
            house : 0,
            farm: 0,
            barn: 0,
            hamlet : 0,
            village : 0,
            town : 0,
            city : 0,
            kingdom : 0,
            empire : 0,
            spnation : 0
        },

        // Store how much (base) points is added per second
        basePointsPerSecond: {
            zenny: 0.1,
            sim: 1,
            death: 0.5,
            house : 0,
            hamlet : 0,
            village : 0,
            town : 0,
            city : 0,
            kingdom : 0,
            empire : 0,
            spnation : 0
        },

        // Store modifier for points per second
        modifier: {
            zenny: 1,
            sim: 1,
            death: 1,
            house : 1,
            hamlet : 0,
            village : 0,
            town : 0,
            city : 0,
            kingdom : 0,
            empire : 0,
            spnation : 0
        },

        limit:{
            zenny: 100000,
            sim: 20,
            house : 1000,
            hamlet : 1000,
            village : 0,
            town : 0,
            city : 0,
            kingdom : 0,
            empire : 0,
            spnation : 0
        },

        UpdateModel: function(){
            service.model.sim += (service.basePointsPerSecond.sim * service.modifier.sim) * 0.017;
            if(service.model.sim >= service.limit.sim){
                service.model.sim = service.limit.sim;
            }
            service.model.zenny += ((service.basePointsPerSecond.zenny * Math.floor(service.model.sim)) * service.modifier.zenny) * 0.017;
            //console.log("tick");
        },

        BuyHouse: function(num){
            service.model.house += num;
            service.model.sim -= num * buildingFactory.house.simPrice;  
            service.model.zenny -= num * buildingFactory.house.zennyPrice;
            service.UpdateModifier();     
            service.UpdateLimit();            
        },

        BuyFarm: function(num){
            while(num > 0){
                service.model.farm ++;
                service.model.zenny -= buildingFactory.farm.zennyPrice;
                
                buildingFactory.house.simPrice = buildingFactory.house.baseSimPrice + (buildingFactory.house.baseSimPrice * (service.model.farm * 0.1));
                buildingFactory.house.zennyPrice = buildingFactory.house.baseZennyPrice + (buildingFactory.house.baseZennyPrice * (service.model.farm * 0.1));
                
                buildingFactory.farm.zennyPrice = buildingFactory.farm.baseZennyPrice + (buildingFactory.farm.baseZennyPrice * service.model.farm);
    
                num --;
            }
            service.UpdateModifier();            
        },

        BuyBarn: function(num){
            while(num > 0){
                service.model.barn ++;
                service.model.zenny -= buildingFactory.barn.zennyPrice;
                buildingFactory.barn.zennyPrice = buildingFactory.barn.baseZennyPrice + (buildingFactory.barn.baseZennyPrice * service.model.barn);
                num --;
            }
            service.UpdateModifier();            
        },

        BuyHamlet: function(num){
            service.model.hamlet += num;
            service.model.house -= num * buildingFactory.hamlet.housePrice;  
            service.model.zenny -= num * buildingFactory.hamlet.zennyPrice;
            service.UpdateModifier();
            service.UpdateLimit();            
        },

        UpdateModifier: function(){
            service.modifier.sim = 1 /* base */
                            + (0.5 * service.model.house) /* house modifier */
                            + (service.model.house * (service.model.farm * 0.1)) /* farm modifier */
                            + (service.model.house * (service.model.barn * 0.2)) /* barn modifier */
                            + (10 * service.model.hamlet); /* hamlet modifier */
                            
            service.modifier.death = 1 /* base */
                            - (0.01 * service.model.house) /* house modifier */
                            + (0.03 * service.model.barn) /* barn modifier */
                            + (0.05 * service.model.barn); /* hamlet modifier */
        },
        
        UpdateLimit: function(){
            service.limit.sim = service.model.house * 66;
        },

        GetSimRate: function(){
            return (service.basePointsPerSecond.sim * service.modifier.sim) - (service.basePointsPerSecond.death * service.modifier.death) /* deat rate*/;
        },

        GetBirthRate: function(){
            return (service.basePointsPerSecond.sim * service.modifier.sim);
        },

        GetDeathRate: function(){
            return (service.basePointsPerSecond.death * service.modifier.death);
        },

        GetZennyRate: function(){
            return (service.basePointsPerSecond.zenny * Math.floor(service.model.sim)) * service.modifier.zenny;
        },
        
        GetIncomeRate: function(){
            return service.basePointsPerSecond.zenny * service.modifier.zenny;
        },
        
        GetHouseRate: function(){
            // TODO
            return 0;
        },

        GetHamletRate: function(){
            // TODO
            return 0;
        },

        SaveState: function () {
            sessionStorage.userService = angular.toJson(service.model);
        },
        RestoreState: function () {
            service.model = angular.fromJson(sessionStorage.userService);
        }
    };
    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);
    return service;
}]);
