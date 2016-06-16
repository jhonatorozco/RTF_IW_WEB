var appClientes = angular.module('solicitudApp');
var servicioListaDispositivos =URL_SERVICIO + "rest/dispositivo";
var serviciocrearSolicitud= URL_SERVICIO + "rest/solicitud/crearSolicitud";
var servicioSolicitudUsuario= URL_SERVICIO + "rest/solicitud/obtenerSolicitudesUsuario";
var servicioObtenerSolicitudes = URL_SERVICIO + "rest/solicitud/obtenerSolicitudesUsuario/";
var servicioObtenerTodasSolicitudes = URL_SERVICIO + "rest/solicitud/obtenerSolicitud";
var servicioRechazarSolicitud = URL_SERVICIO + "rest/solicitud/actualizarEstadoSolicitud/";
var servicioObtenerUsuario = URL_SERVICIO + "rest/usuario/buscarUsuario/";
appClientes.controller('solicitudControlador',function($scope, $location,$route, $cookies,dispositivoService,solicitudService,auth){
	dispositivoService.listaDispositivos().success(function(data){

		$scope.dispositivos = data.dispositivo;

		if (toType($scope.dispositivos) == 'array') {
			$scope.dispositivos = data.dispositivo;
		} else if (toType($scope.dispositivos) == 'object') {
			$scope.dispositivos = [data.dispositivo];
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
					//$location.reload();
					$route.reload();
					alert(data);
			
		});
	};
	
	$scope.logout = function(){
		auth.logout();
	};
	
	solicitudService.getAllSolicitudesUsuario($cookies.nombreUsuario).success(function (data) {
		if (toType(data.solicitudDTOWS) == 'array') {
			$scope.solicitudes = data.solicitudDTOWS;
		} else if (toType(data.solicitudDTOWS) == 'object') {
			$scope.solicitudes = [data.solicitudDTOWS];
			console.log($scope.solicitudes);
		}

	});
	
	$scope.convertirEstado = function(index){
		var estado = $scope.solicitudes[index].estadoSolicitud;
		switch (estado){
			case '0': 
				estado = "Rechazado";
				break;
			case '1': 
				estado = "Aprobado";
				break;
		}
		return estado;
	}
		
});

appClientes.service('dispositivoService', function($http){
	this.listaDispositivos = function(){
		return $http ({
			method: 'GET',
			url:servicioListaDispositivos});
	}
		
});


appClientes.controller('solicitudControladorAdmin',function($scope, $location, $cookies,dispositivoService,solicitudService, auth){

	solicitudService.getAllSolicitudes($cookies.nombreUsuario).success(function (data) {
		if (toType(data.solicitudDTOWS) == 'array') {
			$scope.solicitudes = data.solicitudDTOWS;
		} else if (toType(data.solicitudDTOWS) == 'object') {
			$scope.solicitudes = [data.solicitudDTOWS];
			console.log($scope.solicitudes);
		}

	});
	
	$scope.rechazarSolicitud = function(solicitud){
		solicitudService.rechazarSolicitud($cookies.nombreUsuario, solicitud).success(function(data){
			console.log("La solicitud fue modificada");
			$route.reload();
		});
	}
	
	$scope.logout = function(){
		auth.logout();
	};
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
	
	this.rechazarSolicitud= function(empleado, solicitud){
		return $http ({
			method: 'PUT',
			url: servicioRechazarSolicitud+empleado+"/"+0+"/"+solicitud.id.usuario.correo+
			"/"+solicitud.id.dispositivo.codigo+"/"+solicitud.id.fechaInicio.toString()+"/"+solicitud.id.fechaFin.toString()
			});
		
	}
});
