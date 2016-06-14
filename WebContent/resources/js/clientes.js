
var appClientes = angular.module('Clientes', [ 'ngRoute', 'ngCookies' ]);

var URL_SERVICIO_VALIDAR_USUARIO = 'http://localhost:8081/RTF_IW_Web/rest/usuario/autenticarUsuario';
var URL_SERVICIO_LISTA = 'http://localhost:8075/WSEjemplo/rest/Cliente';
var URL_SERVICIO_GUARDAR = 'http://localhost:8075/WSEjemplo/rest/Cliente';

appClientes.factory('auth', function($cookies,$location){
    return{
    	
    	 login : function(usuario)
         {
             //creamos la cookie con el nombre que nos han pasado
    		 console.log('Creando cookie');
             $cookies.nombreUsuario = usuario,
             //mandamos a la lista de clientes
             $location.url('/listaClientes'); //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Redireccionar despues de loguearse
         },
        
        validarEstado : function(){
        	
            if(typeof($cookies.nombreUsuario) == 'undefined'){
                $location.url('/');
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesi�n lo mandamos a 
            //la lista de clientes
            if(typeof($cookies.nombreUsuario) != 'undefined' && $location.url() == '/'){
                $location.url('/listaClientes'); //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Redireccionar usuario TROLL
            }
        }
    };
});


appClientes.service('Usuarios', function($http) {
	// Llama el servicio web para validar el usuario y la contrase�a
	this.validar = function(usuario, contrasena) {
		return $http({
			method : 'POST',
			url : URL_SERVICIO_VALIDAR_USUARIO+'/'+usuario+'/'+contrasena,
		});
	};

});


//Servicio de angular
//Encargado de hacer los llamados de los servicio web
appClientes.service('Clientes', function($http) {
	// LLena la lista de clientes obteniendolos desde un servicio web. Ojo
	// cambiar aqui la Url
	// Por la url correcta segun donde se encuentre el servicio web
	this.listaClientes = function() {
		return $http({
			method : 'GET',
			url : URL_SERVICIO_LISTA
		});
	};
	
	// Llama el servicio web que guarda un nuevo cliente en el sistema
	this.guardar = function(cliente, usuario) {

		return $http({
			method : 'POST',
			url : URL_SERVICIO_GUARDAR,
			params : {
				cedula : cliente.cedula,
				nombres : cliente.nombre,
				apellidos : cliente.apellidos,
				email : cliente.email,
				usuario : usuario
			}
		});
	};

	
});

//Configura las vistas del aplicativo
appClientes.config([ '$routeProvider', function($routeProvider) {
	
	$routeProvider.when('/', {
		templateUrl : 'login.html', // Cuando se carga la raiz del
		// aplicativo se carga en la vista
		// la lista de clientes
		controller : 'contLogin'
	});
	
	$routeProvider.when('/listaClientes', {
		templateUrl : 'listaClientes.html', // Cuando se carga la raiz del
		// aplicativo se carga en la vista
		// la lista de clientes
		controller : 'contClientes'
	});

	$routeProvider.when('/cliente', {
		templateUrl : 'cliente.html',// Cuando se quiere agregar un cliente,
		// se muestra el formulario para crear
		// un cliente
		controller : 'contCliente'
	});
} 
]);


//Controlador para manejar el formulario de autenticaci�n
appClientes.controller('contLogin', function($scope,auth, Usuarios) {
		    //la funci�n login que llamamos en la vista llama a la funci�n
		    //login de la factoria auth pasando lo que contiene el campo
		    //de texto del formulario
		    $scope.login = function(){
		    	
		    	Usuarios.validar($scope.nombreUsuario, $scope.pws).success(function(data){
		    		console.log(data);
		    		if(data == 'el cliente no existe'){
		    			alert(data);
		    			$scope.nombreUsuario = '';
		    			$scope.pws = '';
		    			return;
		    		}else if(data=='el cliente se autentico de forma exitosa'){
		    			alert(data);
		    			auth.login($scope.nombreUsuario);
		    		}
		    	});
		    };
		 
		});


//Crea el controlador para manejar la lista de clientes, se le inyecta el
//servicio
appClientes.controller('contClientes', function($scope, $location, Clientes) {
	
	Clientes.listaClientes().success(function(data) {
		$scope.clientes = data.clienteWS;
	});
	
	$scope.agregar = function() {
		$location.url('/cliente');
	};

});


appClientes.controller('contCliente', function($scope, $location, $cookies, Clientes) {

	$scope.cliente = {
		nombre : '',
		apellidos : '',
		cedula : '',
		email : ''
	};

	$scope.guardar = function() {
		
		Clientes.guardar($scope.cliente, $cookies.nombreUsuario).success(function(data) {
			$location.url('/listaClientes');
		});

	};

});


//se ejecuta cuando se inicia el modulo angular
appClientes.run(function($rootScope, auth){
    //Se ejecuta cada vez que cambia la ruta
    $rootScope.$on('$routeChangeStart', function()
    {
        //llamamos a checkStatus, el cual lo hemos definido en la factoria auth
        //la cu�l hemos inyectado en la acci�n run de la aplicaci�n
        auth.validarEstado();
    });
});


