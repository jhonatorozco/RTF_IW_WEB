package co.edu.udea.iw.ws;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import co.edu.udea.iw.dto.Dispositivo;
import co.edu.udea.iw.exception.DaoException;
import co.edu.udea.iw.exception.ServiceException;
import co.edu.udea.iw.service.DispositivoService;
import co.edu.udea.iw.service.SolicitudService;

/**
 * Expone los servicios de manera web para la entidad dispositivo
 * @author Yoiner Gomez yoiner.gomez22@gmail.com
 * @version 1
 * @category WS
 */
@Path("dispositivo")
@Component
@Transactional
public class DispositivoWS {
	
	@Autowired
	DispositivoService dispositivoService;
	
	@Autowired
	SolicitudService solicitudService;
	

	/**
	 * Función que permite guardar un dispositivo por medio del método POST 
	 * @param codigo
	 * @param nombre
	 * @param marca
	 * @param caracteristica
	 * @return
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/insertar/212/Tablet/Lenovo/Nuevo
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/insertar?codigo=212&nombre=Tablet&marca=Lenovo&caracteristica=Nuevo
	//@Path("insertar/{codigo}/{nombre}/{marca}/{caracteristica}")
	@Path("insertar")
	@Produces(MediaType.TEXT_PLAIN)
	@POST
	public String guardar(
			@QueryParam("codigo") Integer codigo,
			@QueryParam("nombre") String nombre,
			@QueryParam("marca") String marca,
			@QueryParam("caracteristica") String caracteristica) {
	
		try{	
			dispositivoService.guardarDispositivo(codigo, nombre, marca, caracteristica);
		}catch(ServiceException e){
			return e.getMessage();
		} catch (DaoException e) {
			return e.getMessage();
		}
		return "Dispositivo guardado exitosamente!";
	}
	
	/**
	 * Función que permite modificar un dispositivo por medio del método PUT 
	 * @param codigo
	 * @param nombre
	 * @param marca
	 * @param caracteristica
	 * @return
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/modificar?codigo=212&nombre=Tablet&marca=Lenovo&caracteristica=Nuevo
	@Path("modificar")
	@Produces(MediaType.TEXT_PLAIN)
	@PUT
	public String modificar(
			@QueryParam("codigo") Integer codigo,
			@QueryParam("nombre") String nombre,
			@QueryParam("marca") String marca,
			@QueryParam("caracteristica") String caracteristica) {
	
		try{
			dispositivoService.modificarDispositivo(codigo, nombre, marca, caracteristica);
		}catch(ServiceException e){
			return e.getMessage();
		} catch (DaoException e) {
			return e.getMessage();
		}
		return "Dispositivo modificado exitosamente!";
	}
	
	/**
	 * Función que permite eliminar un dispositivo por medio del método DELETE  
	 * @param codigo
	 * @return
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/eliminar?codigo=212
	@Path("eliminar")
	@Produces(MediaType.TEXT_PLAIN)
	@DELETE
	public String modificar(@QueryParam("codigo") Integer codigo) {
		try{
			dispositivoService.eliminarDispositivo(codigo);
		}catch(ServiceException e){
			return e.getMessage();
		} catch (DaoException e) {
			return e.getMessage();
		}
		return "Dispositivo eliminado exitosamente!";
	}
	
	/**
	 * Permite obtener el detalle de un dispositivo
	 * @param codigo
	 * @return
	 * @throws ServiceException
	 * @throws DaoException
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/111
	@Path("{codigo}")
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public Dispositivo obtenerDispositivo(@PathParam("codigo") int codigo) 
			throws ServiceException, DaoException{
		Dispositivo dispositivo = new Dispositivo();
		dispositivo = dispositivoService.buscarDispositivo(codigo);
		return dispositivo;
	}
	
	/**
	 * Permite obtener todos los dispositivos que no han sido 
	 * solicitados por los usuarios
	 * @return
	 * @throws DaoException
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo/disponibles
	@Path("disponibles")
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public List<Dispositivo> mostrarDispositivosDisponibles() throws DaoException{
		List<Dispositivo> dispositivos = new ArrayList<>();
		dispositivos = solicitudService.obtenerDispositivosDisponibles();
		return dispositivos;
	}
	
	/**
	 * Obtiene todos los dispositivos existentes en la base de datos
	 * @return
	 * @throws DaoException
	 */
	//http://localhost:8081/RTF_IW_Web/rest/dispositivo
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public List<Dispositivo> mostrarTodosDispositivos() throws DaoException{
		List<Dispositivo> dispositivos = new ArrayList<>();
		dispositivos = dispositivoService.obtenerTodos();
		return dispositivos;
	}
	
}
