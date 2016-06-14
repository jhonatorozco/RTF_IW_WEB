var appClientes = angular.module('solicitudApp');
var servicioListaDispositivos ="http://localhost:8081/RTF_IW_Web/rest/dispositivo";
var serviciocrearSolicitud= "http://localhost:8081/RTF_IW_Web/rest/solicitud/crearSolicitud";

appClientes.controller('solicitudControlador',function($scope, $location, $cookies,dispositivoService,solicitudService){
	dispositivoService.listaDispositivos().success(function(data){		
		
		$scope.dispositivos = data.dispositivo;		
		
		if(toType($scope.dispositivos)=='array'){			
		}else if(toType($scope.dispositivos)=='object'){
			
		}
		
	});
	
	$scope.solicitud = {
			dispositivoSeleccionado:'',
			correo : '',
			fechaInicio :new Date(2010, 11, 28, 14, 57),
			fechaFin : new Date(2010, 11, 28, 14, 57),
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
			+ "/"+solicitud.fechaInicio.toString() + "/" +solicitud.fechaFin.toString() +"/"+solicitud.motivo});
	}
		
});
