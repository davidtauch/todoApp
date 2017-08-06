// public/core.js
let Todo = angular.module('Todo', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $scope.createLists = function(data) {
        $scope.todos = data;
        $scope.uncompleted = data.filter(function(data){
            return data.completed == false;
        });
        $scope.completed = data.filter(function(data){
            return data.completed == true;;
        });
    }

    $scope.getTodo = function() {
        $http.get('/api/todos').success(function(data) {
            $scope.createLists(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };


    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.createLists(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
        console.log($scope.editedTodo);
    };

    $scope.enableEditor = function() {
        $scope.editorEnabled = true;
        $scope.editableTitle = $scope.title;
    };

    $scope.disableEditor = function() {
        $scope.editorEnabled = false;
    };

    $scope.save = function() {
        $scope.title = $scope.editableTitle;
        $scope.disableEditor();
    };

    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/delete/' + id)
        .success(function(data) {
            $scope.createLists(data);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.toggleCompleted = function (todo) {
        $http.put(`/api/todos/${todo._id}/${todo.completed}`)
            .success(function(data) {
                $scope.createLists(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
