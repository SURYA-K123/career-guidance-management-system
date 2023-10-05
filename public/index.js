var app = angular.module('carouselApp', ['ngRoute']);
app.controller('CarouselController', function ($scope, $interval) {
    $scope.carouselItems = [
        { imageUrl: 'z.jpg', caption: 'Image 1' },
        { imageUrl: 'z1.jpg', caption: 'Image 2' },
        { imageUrl: 'z2.jpg', caption: 'Image 3' }
    ];

    $scope.currentIndex = 0;
    $scope.isAutoPlay = true;

    var autoPlayInterval;

    $scope.next = function () {
        $scope.currentIndex = ($scope.currentIndex + 1) % $scope.carouselItems.length;
    };

    $scope.prev = function () {
        $scope.currentIndex = ($scope.currentIndex - 1 + $scope.carouselItems.length) % $scope.carouselItems.length;
    };

    $scope.toggleAuto = function () {
        $scope.isAutoPlay = !$scope.isAutoPlay;
        if ($scope.isAutoPlay) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    };

    function startAutoPlay() {
        autoPlayInterval = $interval(function () {
            if ($scope.isAutoPlay) {
                $scope.next();
            }
        }, 3000);
    }

    function stopAutoPlay() {
        if (angular.isDefined(autoPlayInterval)) {
            $interval.cancel(autoPlayInterval);
        }
    }

    startAutoPlay();
});

app.controller('myCtrl1', ['$scope', 'ReviewService', function ($scope, ReviewService) {
    $scope.reviews = [];

    $scope.ratings = [5, 4, 3, 2, 1];
    $scope.selectedRating = '';
    $scope.newReview = {
        userName: '',
        rating: '',
        comment: ''
    };

    $scope.loadReviews = function () {
        ReviewService.loadReviewsFromServer().then(function(response) {
            $scope.reviews = response.data;
            console.log($scope.reviews);
        });
    };

    $scope.loadReviews();

    $scope.addReview = function () {
        ReviewService.addReviewToServer($scope.newReview).then(function(response) {
            $scope.reviews.push($scope.newReview);
            console.log('Review added:', response.data.message);
            $scope.loadReviews();
        });
    };
}]);

app.service('ReviewService', ['$http', function($http) {
    var service = this;
    var a = {};

    service.loadReviewsFromServer = function() {
        return $http.get('/review')
            .catch(function(error) {
                console.error('Error fetching reviews:', error);
            });
    };

    service.addReviewToServer = function(review) {
        return $http.post('/review', {review : review})
        .then(function(response) {
            console.log('HTTP request successful:', response.data);
        })
        .catch(function(error) {
            console.error('Error adding review:', error);
        });
    };
}]);

  
app.controller('itemAdder', ['$scope', '$http', 'ShoppingListService', function($scope, $http, ShoppingListService) {
    ShoppingListService.loadSessionsFromServer().then(function() {
        $scope.sessions = ShoppingListService.getItems1();
    });

    ShoppingListService.loadSessionsFromServer1().then(function(){
        $scope.added = ShoppingListService.getItems2();
    });

    $scope.addItem = function(index) {
        var selectedItem = $scope.sessions[index];
        ShoppingListService.addItem(selectedItem)
            .then(function(response) {
                console.log('Item added to the cart:', response.data.message);
            })
            .catch(function(error) {
            });
    };

    $scope.removeSession = function(index) {
        var removedItem = $scope.added[index];
        console.log(removedItem);
        ShoppingListService.removeSession(removedItem)
            .then(function(response) {
                console.log('Session removed from the cart:', response.data.message);
                $scope.added.splice(index, 1);
            })
            .catch(function(error) {
                console.error('Error removing session:', error);
            });
    };
}]);

app.service('ShoppingListService', ['$http', function($http) {
    var service = this;
    var items = [];
    var sessions = [];
    
    service.addItem = function(item) {
        return $http.post('/addToCart', { item: item })
            .then(function(response) {
                items.push(item);
                console.log('Item added successfully:', response.data.message);
                return response;
            })
            .catch(function(error) {
                throw error; 
            }); 
    };

    service.loadSessionsFromServer = function() {
        return $http.get('/session')
            .then(function(response) {
                sessions = response.data;
                console.log(sessions);
            })
            .catch(function(error) {
                console.error('Error fetching sessions:', error);
            });
    };

    service.loadSessionsFromServer1 = function() {
        return $http.get('/cart')
            .then(function(response) {
                items = response.data;
                console.log(items);
            })
            .catch(function(error) {
                console.error('Error fetching sessions:', error);
            });
    };

    service.removeSession = function(item) {
        return $http.delete('/removeFromCart/' + item._id)
            .then(function(response) {
                console.log('Session removed from the cart:', response.data.message);
                return response;
            })
            .catch(function(error) {
                throw error;
            });
    };


    service.getItems1 = function() {
        return sessions;
    };

    service.getItems2 = function() {
        return items;
    };
}]);





app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './home.html'
        })
        .when('/review', {
            templateUrl: './review.html'
        })
        .when('/session', {
            templateUrl: './form.html'
        })
        .when('/medical',{
            templateUrl : './medical.html'
        })
        .when('/engineering',{
            templateUrl : './engineering.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
