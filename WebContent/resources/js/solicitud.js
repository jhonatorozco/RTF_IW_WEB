var app = angular.module('solicitudApp', []);
var servicioListaDispositivos ="http://localhost:8082/RTF_IW_Web/rest/dispositivo";
var serviciocrearSolicitud= "http://localhost:8082/RTF_IW_Web/rest/solicitud/crearSolicitud";
app.controller('crearClienteControlador',function($scope,dispositivoService,solicitudService){
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
			
			solicitudService.crearSolicitud($scope.solicitud).success(function(data) {
				alert(data);
			});

		};

	
});

app.service('dispositivoService', function($http){
	this.listaDispositivos = function(){
		return $http ({
			method: 'GET',
			url:servicioListaDispositivos});
	}
		
});


app.service('solicitudService', function($http){
	this.crearSolicitud = function(solicitud){
		return $http ({
			method: 'POST',
			url:serviciocrearSolicitud+"/"+solicitud.correo +"/"+solicitud.dispositivoSeleccionado.codigo
			+ "/"+solicitud.fechaInicio+"/"+solicitud.fechaFin +"/"+solicitud.motivo});
	}
		
});
