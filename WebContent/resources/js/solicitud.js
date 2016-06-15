var appClientes = angular.module('solicitudApp', [ 'ngRoute', 'ngCookies' ]);
var servicioListaDispositivos ="http://localhost:8082/RTF_IW_Web/rest/dispositivo";
var serviciocrearSolicitud= "http://localhost:8082/RTF_IW_Web/rest/solicitud/crearSolicitud";
var servicioSolicitudUsuario= "http://localhost:8082/RTF_IW_Web/rest/solicitud/obtenerSolicitudesUsuario";
appClientes.controller('crearClienteControlador',function($scope, $location, $cookies,dispositivoService,solicitudService){
	dispositivoService.listaDispositivos().success(function(data){
		$scope.dispositivos = data.dispositivo;
		
	});
	
	$scope.solicitud = {
			dispositivoSeleccionado:'',
			correo : '',
			fechaInicio : '',
			fechaFin : '',
			motivo : ''
			
		};

		$scope.guardar = function() {
			
			solicitudService.crearSolicitud($scope.solicitud,$cookies.nombreUsuario).success(function(data) {
				alert(data);
			});

		};

	
});

appClientes.service('dispositivoService', function($http){
	this.listaDispositivos = function(){
		return $http ({
			method: 'GET',
			url:servicioListaDispositivos});
	}
		
});


appClientes.service('solicitudService', function($http){
	this.crearSolicitud = function(solicitud,usuario){
		return $http ({
			method: 'POST',
			url:serviciocrearSolicitud+"/"+ usuario +"/"+solicitud.dispositivoSeleccionado.codigo
			+ "/"+solicitud.fechaInicio+"/"+solicitud.fechaFin +"/"+solicitud.motivo});
	}
		
});
