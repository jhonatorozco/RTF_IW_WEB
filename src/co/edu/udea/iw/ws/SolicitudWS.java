package co.edu.udea.iw.ws;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import co.edu.udea.iw.dto.Dispositivo;
import co.edu.udea.iw.dto.Solicitud;
import co.edu.udea.iw.dto.SolicitudId;
import co.edu.udea.iw.dto.Usuario;
import co.edu.udea.iw.exception.DaoException;
import co.edu.udea.iw.exception.ServiceException;
import co.edu.udea.iw.service.DispositivoService;
import co.edu.udea.iw.service.SolicitudService;
import co.edu.udea.iw.service.UsuarioService;
import javassist.tools.rmi.RemoteException;
import co.edu.udea.iw.ws.dto.SolicitudDTOWS;
/**
 * Expone los servicios de manera web para la entidad Solicitud
 * @author Jhonatan Orozco jhonatorozco@gmail.com
 * @version 1
 * @category WS
 */
@Transactional
@Component
@Path("solicitud")
public class SolicitudWS {

	@Autowired
	SolicitudService solicitudService;
	
	@Autowired
	UsuarioService usuarioService;
	
	@Autowired
	DispositivoService dispositivoService;
		/**
		 * Es el servicio web que permite crear una solicitud por medio del metodo
		 * registrarSolicitud() que hace parte de SolicitudService.En caso de que
		 * la solicitud no pueda ser insertada se genera una salida con el mensaje
		 * del error respectivo.
		 * @param correo
		 * @param codigoDispositivo
		 * @param fechaInicio
		 * @param fechaFin
		 * @param estadoSolicitud
		 * @param motivo
		 * @return
		 */
		@Path("crearSolicitud/{correo}/{idDispositivo}/{fechaInicio}/{fechaFin}/{motivo}")
		@Produces(MediaType.TEXT_PLAIN)
		@POST
		public String crearSolicitud(@PathParam("correo") String correo,
				@PathParam("idDispositivo") int codigoDispositivo,
				@PathParam("fechaInicio") String fechaInicio,
				@PathParam("fechaFin") String fechaFin,
				@PathParam("motivo") String motivo){
			try{
				solicitudService.registrarSolicitud(correo, codigoDispositivo, fechaInicio, fechaFin,motivo);
			}catch(DaoException e){
				return e.getMessage();
			}catch(ServiceException e){
				return e.getMessage();
			}catch (ParseException e) {
				return e.getMessage();
			}
			return "La solicitud ha sido registrada";
		}
		/**
		 * Es el servicio web que permite obtener todas las solicitudes
		 * asociadas a un usuario, para ello se retorna una lista con objetos
		 * de la clase SolicitudDTOWS que se basa en el DTO Solicitud. La respuesta
		 * se produce en formato json
		 * @param correo
		 * @return
		 */
		@Path("obtenerSolicitudesUsuario/{correo}")
		@Produces(MediaType.APPLICATION_JSON)
		@GET
		public List<SolicitudDTOWS> obtenerSolicitudesUsuario(@PathParam("correo") String correo){
				List<SolicitudDTOWS> lista=new ArrayList<SolicitudDTOWS>();
				try{
					for(Solicitud solicitud: solicitudService.listarSolicitudesDeUnUsuario(correo)){
						SolicitudDTOWS solicitudDTOWS=new SolicitudDTOWS();
						solicitudDTOWS.setId(solicitud.getId());
						solicitudDTOWS.setEstadoSolicitud(solicitud.getEstadoSolicitud());
						lista.add(solicitudDTOWS);
					}
				}catch(DaoException e){
					throw new RemoteException(e);
				}catch(ServiceException e){
					throw new RemoteException(e);
				}
				return lista;
		}
		
		/**
		 * Es el servicio web que permite obtener todas las solicitudes
		 * asociadas a un usuario, para ello se retorna una lista con objetos
		 * de la clase SolicitudDTOWS que se basa en el DTO Solicitud. La respuesta
		 * se produce en formato json
		 * @param correo
		 * @return
		 */
		@Path("obtenerSolicitud")
		@Produces(MediaType.APPLICATION_JSON)
		@GET
		public List<SolicitudDTOWS> obtenerSolicitudes(){
				List<SolicitudDTOWS> lista=new ArrayList<SolicitudDTOWS>();
				try{
					for(Solicitud solicitud: solicitudService.getSolicitudDAO().obtenerTodas()){
						SolicitudDTOWS solicitudDTOWS=new SolicitudDTOWS();
						solicitudDTOWS.setId(solicitud.getId());
						solicitudDTOWS.setEstadoSolicitud(solicitud.getEstadoSolicitud());
						if(solicitud.getEstadoSolicitud()!=0){
							lista.add(solicitudDTOWS);
						}
					}
				}catch(DaoException e){
					throw new RemoteException(e);
				}
				return lista;
		}
		
		/**
		 * Servicio web que permite actualizar el estado de una solicitud. Se retorna un
		 * json con la solicitud que fue exitosamente modificada.
		 * @param empCorreo
		 * @param estadoNuevo
		 * @param usuCorreo
		 * @param codigoDispositivo
		 * @param fechaInicioStr
		 * @param fechaFinStr
		 * @return
		 */
		@Path("actualizarEstadoSolicitud/{empleadoCorreo}/{estado}/{correoUsuario}/{idDispositivo}/{fechaInicio}/{fechaFin}")
		@Produces(MediaType.APPLICATION_JSON)
		@PUT
		public SolicitudDTOWS actualizarEstadoSolicitud(@PathParam("empleadoCorreo") String empCorreo,
				@PathParam("estado") int estadoNuevo,
				@PathParam("correoUsuario") String usuCorreo,
				@PathParam("idDispositivo") int codigoDispositivo,
				@PathParam("fechaInicio") String fechaInicioStr,
				@PathParam("fechaFin") String fechaFinStr){
			SolicitudId id=new SolicitudId();
			Usuario usuario=null;
			Dispositivo dispositivo=null;
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			Date fechaInicio=null;
			Date fechaFin=null;
			SolicitudDTOWS solicitudDTOWS=null;
			try{
				usuario=usuarioService.buscarUsuario(usuCorreo);
				dispositivo=dispositivoService.buscarDispositivo(codigoDispositivo);
				fechaInicioStr=fechaInicioStr.replace('T',' ');
				fechaInicio=dateFormat.parse(fechaInicioStr);
				fechaFinStr=fechaFinStr.replace('T',' ');
				fechaFin=dateFormat.parse(fechaFinStr);
				id.setUsuario(usuario);
				id.setDispositivo(dispositivo);
				id.setFechaInicio(fechaInicio);
				id.setFechaFin(fechaFin);
				
				Solicitud solicitud=solicitudService.cambiarEstadoSolicitud(empCorreo, estadoNuevo, id);
				solicitudDTOWS=new SolicitudDTOWS();
				solicitudDTOWS.setEstadoSolicitud(solicitud.getEstadoSolicitud());
				solicitudDTOWS.setId(solicitud.getId());
			}catch(DaoException e){
				throw new RemoteException(e);
			}catch(ServiceException e){
				throw new RemoteException(e);
			}catch (ParseException e) {
				throw new RemoteException(e);
			}
			return solicitudDTOWS;
		}
		
		/**
		 * Servicio web que permite buscar una solicitud por los campos que son
		 * clave primaria en la entidad Solicitud.Se retorna un json con la solicitud
		 * asociada a los parametos enviados.
		 * @param correo
		 * @param codigoDispositivo
		 * @param fechaInicioStr
		 * @param fechaFinStr
		 * @return
		 */
		@Path("buscarSolicitud/{correo}/{idDispositivo}/{fechaInicio}/{fechaFin}")
		@Produces(MediaType.APPLICATION_JSON)
		@GET
		public SolicitudDTOWS buscarSolicitudPorId(
				@PathParam("correo") String correo,
				@PathParam("idDispositivo") int codigoDispositivo,
				@PathParam("fechaInicio") String fechaInicioStr,
				@PathParam("fechaFin") String fechaFinStr){
			SolicitudDTOWS solicitudDTOWS=null;
			try{
				Solicitud solicitud=solicitudService.buscarSolicitud(correo, codigoDispositivo, 
						fechaInicioStr, fechaFinStr);
				solicitudDTOWS=new SolicitudDTOWS();
				solicitudDTOWS.setEstadoSolicitud(solicitud.getEstadoSolicitud());
				solicitudDTOWS.setId(solicitud.getId());
			}catch(DaoException e){
				throw new RemoteException(e);
			}catch(ServiceException e){
				throw new RemoteException(e);
			}catch (ParseException e) {
				throw new RemoteException(e);
			}
			return solicitudDTOWS;
		}

}
