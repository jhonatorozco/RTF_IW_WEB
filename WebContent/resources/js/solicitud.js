var appClientes = angular.module('solicitudApp');
var servicioListaDispositivos =URL_SERVICIO + "rest/dispositivo";
var serviciocrearSolicitud= URL_SERVICIO + "rest/solicitud/crearSolicitud";
var servicioSolicitudUsuario= URL_SERVICIO + "rest/solicitud/obtenerSolicitudesUsuario";
var servicioObtenerSolicitudes = URL_SERVICIO + "rest/solicitud/obtenerSolicitudesUsuario/";
var servicioObtenerTodasSolicitudes = URL_SERVICIO + "rest/solicitud/obtenerSolicitud";
var servicioRechazarSolicitud = URL_SERVICIO + "rest/solicitud/actualizarEstadoSolicitud/";
appClientes.controller('solicitudControlador',function($scope, $location, $cookies,dispositivoService,solicitudService){
	dispositivoService.listaDispositivos().success(function(data){

		$scope.dispositivos = data.dispositivo;

		if (toType($scope.dispositivos) == 'array') {
		} else if (toType($scope.dispositivos) == 'object') {

		}

	});

	$scope.solicitud = {
		dispositivoSeleccionado : '',
		correo : '',
		fechaInicio : new Date(2010, 11, 28, 14, 57),
		fechaFin : new Date(2010, 11, 28, 14, 57),
		motivo : ''

	};

	$scope.guardar = function() {
		solicitudService.crearSolicitud($scope.solicitud,
				$cookies.nombreUsuario).success(function(data) {
					$location.reload();
					alert(data);
			
		});
	};
	
	solicitudService.getAllSolicitudesUsuario($cookies.nombreUsuario).success(function (data) {
		if (toType(data.solicitudDTOWS) == 'array') {
			$scope.solicitudes = data.solicitudDTOWS;
		} else if (toType(data.solicitudDTOWS) == 'object') {
			$scope.solicitudes = [data.solicitudDTOWS];
			console.log($scope.solicitudes);
		}

	});
		
});

appClientes.service('dispositivoService', function($http){
	this.listaDispositivos = function(){
		return $http ({
			method: 'GET',
			url:servicioListaDispositivos});
	}
		
});

appClientes.controller('solicitudControladorAdmin',function($scope, $location, $cookies,dispositivoService,solicitudService){

	solicitudService.getAllSolicitudes($cookies.nombreUsuario).success(function (data) {
		if (toType(data.solicitudDTOWS) == 'array') {
			$scope.solicitudes = data.solicitudDTOWS;
		} else if (toType(data.solicitudDTOWS) == 'object') {
			$scope.solicitudes = [data.solicitudDTOWS];
			console.log($scope.solicitudes);
		}

	});
	
	rechazarSolicitud = function(solicitud){
		solicitud;
	}
});

appClientes.service('solicitudService', function($http){
	this.crearSolicitud = function(solicitud,usuario){
		return $http ({
			method: 'POST',
			url:serviciocrearSolicitud+"/"+ usuario +"/"+solicitud.dispositivoSeleccionado.codigo
			+ "/"+solicitud.fechaInicio.toString() + "/" +solicitud.fechaFin.toString() +"/"+solicitud.motivo});
	}
	
	this.getAllSolicitudesUsuario = function(usuario) {
		return $http ({
			method: 'GET',
			url:servicioObtenerSolicitudes+usuario});
	}
	
	this.getAllSolicitudes = function() {
		return $http ({
			method: 'GET',
			url:servicioObtenerTodasSolicitudes});
	} 
	
	this.getAllSolicitudes = function() {
		return $http ({
			method: 'GET',
			url:servicioObtenerTodasSolicitudes});
	} 
});
