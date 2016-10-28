(function(){
  'use strict'
  angular.module('filter', ['ngMaterial']); //initialize module

  //can reference model instead of creating a global variable
  angular.module('filter').controller('angularController', 
                                           ['$scope','ProductDataService', function($scope, ProductDataService) { 
    var products = ProductDataService.getSampleData();
    $scope.hospitals = products; //use $scope to expose to the view

    //create checkbox filters with dynamic data
    var filters = [];
    _.each(products, function(product) {
      _.each(product.properties, function(property) {      
        var existingFilter = _.findWhere(filters, { name: property.name });

        if (existingFilter) {
          var existingOption = _.findWhere(existingFilter.options, { value: property.value });
          if (existingOption) {
            existingOption.count += 1;
          } else {
            existingFilter.options.push({ value: property.value, count: 1 }); 
          }   
        } else {
          var filter = {};
          filter.name = property.name;
          filter.options = [];
          filter.options.push({ value: property.value, count: 1 });
          filters.push(filter);      
        }   
      });
    });
    $scope.Filters = filters;

    this.toggleAll = function($event, includeAll) {       
      _.each(filters, function(filterCategory) {      
        _.each(filterCategory.options, function(option) {
          option.IsIncluded = includeAll;
        });
      });    
    };
  }]);

  angular.module('filter').filter('dynamicFilter', function () {
    return function (products, filterCategories, scope) {
      var filtered = [];

      var productFilters = _.filter(filterCategories, function(fc) {
        return  _.any(fc.options, { 'IsIncluded': true });
      });

      _.each(products, function(prod) {
        var includeProduct = true;
        _.each(productFilters, function(filter) {
          var props = _.filter(prod.properties, { 'name': filter.name });
          if (!_.any(props, function(prop) { return _.any(filter.options, { 'value': prop.value, 'IsIncluded': true }); })) {
            includeProduct = false;
          }
        });
        if (includeProduct) {
          filtered.push(prod);
        }
      });
      return filtered;
    };
  });

  angular.module('filter').service('ProductDataService', function() {
    var service = {};

    //sample data
    var products = [
      {
       link:"https://s3.postimg.org/4nj2fnon7/Boston_Childrens_Hospital1.jpg",name: "Boston's Children Hospital",address:"300   Longwood Ave,Boston, MA 02115,  Phone:(617) 754-5000",  
        properties: [
          { name:'Neighbourhood', value:'Mission Hill'}, { name:'Category', value:'Hospital' }, 
         { name:'Features', value:'By appointment only' }
        ]
      },{
         link:"https://s3.postimg.org/x4ddvywtv/091014_new_england_baptist.jpg",name: 'New England Bapist Hospital',address:"125 Parker Hill Ave,Boston, MA 02120,  Phone:(617) 754-5000",
        properties: [
          { name:'Neighbourhood', value:'Mission Hill' }, { name:'Category', value:'Hospital'},
           { name:'Features', value:'By appointment only'},{name:'Parking',value:'Street'}
        ]
      },{
        link:"https://s3.postimg.org/k6fapdhg3/meei.jpg",name: 'Massachussets Eye and Ear',address:"243 Charles Street,Boston, MA 02114,  Phone:(617) 754-5000",
        properties: [
          { name:'Neighbourhood', value:'WestEnd' }, { name:'Category', value:'Hospital' },
          { name:'Category', value:'Opthamology' }, { name:'Category', value:'Otolaryngology' }, { name:'Features', value:'By appointment only'}
        ]
      },{
        link:"https://s4.postimg.org/4oezbyg6l/s_ne_hlt_cjrs_cardio_2.jpg",name: "Brigham and Women's Hospital",address:"75 Francis Street,Boston, MA 02115,   Phone (617) 732-5500",
        properties: [
          { name:'Neighbourhood', value:'Mission Hill' },{ name:'Category', value:'Urgent Care' },
         { name:'Category', value:'Ear, Nose & Throat' },{ name:'Category', value:' Orthopedists' }, { name:'Category', value:'Hospital' },{ name:'Features', value:'Offering a Deal' },{ name:'Parking', value:'Valet' },{ name:'Price', value:'$$' },
        ]
      },{
        link:"https://s3.postimg.org/9sogqxq03/20121015_whiteramp_composite_web.jpg",name: 'Massachussets General Hospital',address:"55 Fruit St,Boston, MA 02114   Phone (617) 726-2000",
        properties: [
          { name:'Neighbourhood', value:'WestEnd' }, { name: 'Category', value: 'Urgent Care' },
          { name:'Category', value:'Ear, Nose & Throat' },{ name: 'Features', value: 'Open Now' },{ name: 'Features', value: 'Pokestop Nearby' },{ name: 'Price', value: '$' },{ name:'Parking', value:'Garage' }
        ]
      }
	  
	  
    ];

    service.getSampleData = function() {
      return products;
    };

    return service;
  });

})();

