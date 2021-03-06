var appClientes = angular.module('solicitudApp', [ 'ngRoute', 'ngCookies' ]);
var URL_SERVICIO = 'http://localhost:8081/RTF_IW_Web/';
var URL_SERVICIO_VALIDAR_USUARIO = URL_SERVICIO
		+ 'rest/usuario/autenticarUsuario';
var URL_SERVICIO_LISTA = URL_SERVICIO + 'rest/Cliente';
var URL_SERVICIO_GUARDAR = URL_SERVICIO + 'rest/Cliente';
var servicioListaDispositivos = URL_SERVICIO + "rest/dispositivo";
var serviciocrearSolicitud = URL_SERVICIO + "rest/solicitud/crearSolicitud";

var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
};

appClientes.factory('auth', function($cookies, $location,$cookieStore) {
	return {

		login : function(usuario,rol) {
			var enlace = '/creacionSolicitud';
			if(rol!=3){
				enlace = '/administrar';
			}
			// creamos la cookie con el nombre que nos han pasado
			console.log('Creando cookie'+rol);
			$cookies.nombreUsuario = usuario,
			// mandamos a la lista de clientes
			$location.url(enlace); // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
													// Redireccionar despues de
													// loguearse
		},
		
		logout : function(){
			console.log('Eliminando cookie');
			$cookieStore.remove("nombreUsuario"); //Cerrar sesion (Se necesita el $cookieStore) 
			$location.url('/');
		},

		validarEstado : function() {

			if (typeof ($cookies.nombreUsuario) == 'undefined') {
				$location.url('/');
			}
			// en el caso de que intente acceder al login y ya haya iniciado
			// sesi�n lo mandamos a
			// la lista de clientes
			if (typeof ($cookies.nombreUsuario) != 'undefined'
					&& $location.url() == '/') {
				$location.url('/creacionSolicitud'); // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
														// Redireccionar usuario
														// TROLL
			}
		}
	};
});

appClientes.service('Usuarios', function($http) {
	// Llama el servicio web para validar el usuario y la contrase�a
	this.validar = function(usuario, contrasena) {
		return $http({
			method : 'POST',
			url : URL_SERVICIO_VALIDAR_USUARIO + '/' + usuario + '/'
					+ contrasena,
		});
	};
	
	this.obtenerUsuario = function(usuario){
		return $http ({
			method: 'GET',
			url:servicioObtenerUsuario+usuario});
	}

});

// Servicio de angular
// Encargado de hacer los llamados de los servicio web
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

// Configura las vistas del aplicativo
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

	$routeProvider.when('/creacionSolicitud', {
		templateUrl : 'creacionSolicitud.html', // Cuando se carga la raiz del
		// aplicativo se carga en la vista
		// la lista de clientes
		controller : 'solicitudControlador'
	});
	
	$routeProvider.when('/administrar', {
		templateUrl : 'solicitudAdmin.html', // Cuando se carga la raiz del
		// aplicativo se carga en la vista
		// la lista de clientes
		controller : 'solicitudControladorAdmin'
	});
} ]);

// Controlador para manejar el formulario de autenticaci�n
appClientes.controller('contLogin',function($scope, auth, Usuarios) {
					// la funci�n login que llamamos en la vista llama a la
					// funci�n
					// login de la factoria auth pasando lo que contiene el
					// campo
					// de texto del formulario
					$scope.login = function() {

						Usuarios
								.validar($scope.nombreUsuario, $scope.pws)
								.success(
										function(data) {
											console.log(data);
											if (data == 'el cliente no existe') {
												alert(data);
												$scope.nombreUsuario = '';
												$scope.pws = '';
												return;
											} else if (data == 'el cliente se autentico de forma exitosa') {
												var rol = 0;
												Usuarios
													.obtenerUsuario($scope.nombreUsuario)
														.success(function(response){
															rol = response.rol.id;
															auth.login($scope.nombreUsuario,response.rol.id);
													console.log();
												});
												alert(data);
											}
										});
						
						
					};

				});

// Crea el controlador para manejar la lista de clientes, se le inyecta el
// servicio

appClientes.controller('contClientes', function($scope, $location, Clientes) {

	Clientes.listaClientes().success(function(data) {
		$scope.clientes = data.clienteWS;
	});

	$scope.agregar = function() {
		$location.url('/cliente');
	};

});

appClientes.controller('contCliente', function($scope, $location, $cookies,
		Clientes) {

	$scope.cliente = {
		nombre : '',
		apellidos : '',
		cedula : '',
		email : ''
	};

	$scope.guardar = function() {

		Clientes.guardar($scope.cliente, $cookies.nombreUsuario).success(
				function(data) {
					$location.url('/creacionSolicitud');
				});

	};

});

// se ejecuta cuando se inicia el modulo angular
appClientes.run(function($rootScope, auth) {
	// Se ejecuta cada vez que cambia la ruta
	$rootScope.$on('$routeChangeStart', function() {
		// llamamos a checkStatus, el cual lo hemos definido en la factoria auth
		// la cu�l hemos inyectado en la acci�n run de la aplicaci�n
		auth.validarEstado();
	});
});
