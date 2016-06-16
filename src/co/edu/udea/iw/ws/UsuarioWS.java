package co.edu.udea.iw.ws;

import javax.ws.rs.DELETE;
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

import co.edu.udea.iw.dto.Usuario;
import co.edu.udea.iw.ws.dto.UsuarioDtoWs;
import javassist.tools.rmi.RemoteException;
import co.edu.udea.iw.exception.DaoException;
import co.edu.udea.iw.exception.ServiceException;
import co.edu.udea.iw.service.UsuarioService;


//import org.springframework.http.MediaType;
//a que ruta funciona el servicio web
/**
 * Servicios Web que proveen los metodos de la logica de negocio de usuario
 * @author Santiago G�mez santiago.gomezg@udea.edu.co
 * @category WS
 * @version 1
 */
@Transactional
@Component
@Path("usuario")
public class UsuarioWS {
	@Autowired
	UsuarioService usuarioService;
	/**
	 * Servicio web para autenticar un usuario
	 * Retorna un Boolean que confirma si el usuario se autentic� de forma correcta
	 * @param correo
	 * @param contrasena
	 * @return
	 */
	//http://localhost:8082/RTF_IW_Web/rest/usuario/autenticarUsuario/santiago@udea/123456
	@Path("autenticarUsuario/{correo}/{contrasena}")
	@Produces(MediaType.TEXT_PLAIN)
	@POST
	public String autenticar(
			@PathParam("correo") String correo,
			@PathParam("contrasena") String contrasena){
			Boolean autenticado=false;
				try {
					autenticado=usuarioService.autenticarUsuario(correo, contrasena);
				} catch (DaoException | ServiceException e) {

					return e.getMessage();
				}
				if(autenticado){
					return "el cliente se autentico de forma exitosa";
				}else
				return "el cliente no existe";
	}
	/**
	 * Servicio web para buscar un usuario
	 * Retorna un String en formato Json que retorna la c�dula y el nombre del usuario
	 * en caso de que lo encuentre y retorna un mensaje de error en caso de que no
	 * @param correo
	 * @return
	 */
	//http://localhost:8082/RTF_IW_Web/rest/usuario/buscarUsuario/pepe@udea
	@Path("buscarUsuario/{correo}")
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public UsuarioDtoWs buscar (
			@PathParam("correo") String correo) throws DaoException, ServiceException{
			UsuarioDtoWs usuarioDtoWs = new UsuarioDtoWs();
			Usuario usuario;
			String mensaje;
				try {
					usuario=usuarioService.buscarUsuario(correo);
					usuarioDtoWs.setCorreo(usuario.getCorreo());
					usuarioDtoWs.setCedula(usuario.getCedula());
					usuarioDtoWs.setNombre(usuario.getNombre());
					usuarioDtoWs.setApellido(usuario.getApellido());
					usuarioDtoWs.setRol(usuario.getRol());
					
				} catch (DaoException | ServiceException e) {
					throw new RemoteException(e);
				}
				return usuarioDtoWs;
	}
	/**
	 * Servicio Web para registrar un usuario
	 * Retorna un String que informa si el registro se realiz� de forma correcta o tuvo alg�n problema 
	 * @param correo
	 * @param cedula
	 * @param nombre
	 * @param apellido
	 * @param contrasena
	 * @param rol
	 * @return
	 * @throws NumberFormatException
	 * @throws Exception
	 */
	//http://localhost:8082/RTF_IW_Web/rest/usuario/registrarUsuario/pepe@udea/939393435/pepito/perez/741852963/1
	@POST
	@Path("registrarUsuario/{correo}/{cedula}/{nombre}/{apellido}/{contrasena}/{rol}")
	@Produces(MediaType.TEXT_HTML)
	public String registrar(
			@PathParam("correo") String correo,
			@PathParam("cedula") String cedula,
			@PathParam("nombre") String nombre,
			@PathParam("apellido") String apellido,
			@PathParam("contrasena") String contrasena,
			@PathParam("rol") String rol) throws NumberFormatException, Exception{
				try {
					usuarioService.registrarUsuario(correo, cedula, nombre, apellido, contrasena, rol);
				} catch (DaoException | ServiceException e) {
					return e.getMessage();
				}
				return "usuario registrado exitosamente";
	}
	/**
	 * Servico Web para modificar un usuario
	 * Retorna un String que informa si la modificaci�n se realiz� de forma correcta o tuvo alg�n problema
	 * @param correo
	 * @param cedula
	 * @param nombre
	 * @param apellido
	 * @param contrasena
	 * @param rol
	 * @return
	 * @throws NumberFormatException
	 * @throws Exception
	 */
	//http://localhost:8082/RTF_IW_Web/rest/usuario/modificarUsuario/pepe@udea/939393435/pepito/perez/741852963/1
	@Path("modificarUsuario/{correo}/{cedula}/{nombre}/{apellido}/{contrasena}/{rol}")
	@Produces(MediaType.TEXT_PLAIN)
	@PUT
	public String modificar(
			@PathParam("correo") String correo,
			@PathParam("cedula") String cedula,
			@PathParam("nombre") String nombre,
			@PathParam("apellido") String apellido,
			@PathParam("contrasena") String contrasena,
			@PathParam("rol") String rol) throws NumberFormatException, Exception{
				try {
					usuarioService.modificarUsuario(correo, cedula, nombre, apellido, contrasena, rol);
				} catch (DaoException | ServiceException e) {
					return e.getMessage();
				}
				return "usuario modificado exitosamente";
	}
	/**
	 * Servico Web para eliminar un usuario
	 * Retorna un String que informa si la eliminaci�n se realiz� de forma correcta o tuvo alg�n problema
	 * @param correo
	 * @param cedula
	 * @param nombre
	 * @param apellido
	 * @param contrasena
	 * @param rol
	 * @param usuarioElimina
	 * @return
	 * @throws NumberFormatException
	 * @throws Exception
	 */
	//http://localhost:8082/RTF_IW_Web/rest/usuario/eliminarUsuario/pepe@udea/939393435/pepito/perez/741852963/1/santiago@udea
	@Path("eliminarUsuario/{correo}/{cedula}/{nombre}/{apellido}/{contrasena}/{rol}/{usuarioElimina}")
	@Produces(MediaType.TEXT_PLAIN)
	@DELETE
	public String eliminar(
			@PathParam("correo") String correo,
			@PathParam("cedula") String cedula,
			@PathParam("nombre") String nombre,
			@PathParam("apellido") String apellido,
			@PathParam("contrasena") String contrasena,
			@PathParam("rol") String rol,
			@PathParam("usuarioElimina") String usuarioElimina) throws NumberFormatException, Exception{
				try {
					usuarioService.eliminarUsuario(correo, cedula, nombre, apellido, contrasena, rol, usuarioElimina);
				} catch (DaoException | ServiceException e) {
					return e.getMessage();
				}
				return "usuario eliminado exitosamente";
	}
}
