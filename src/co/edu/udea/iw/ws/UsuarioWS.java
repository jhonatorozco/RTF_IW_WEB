package co.edu.udea.iw.ws;

import javax.ws.rs.GET;
//import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;


//import org.springframework.http.MediaType;
//a que ruta funciona el servicio web
@Path("usuario")
public class UsuarioWS {

	@Path("saludo2")
	@Produces(MediaType.TEXT_HTML)
	@GET
	public String saludarDos(@QueryParam("nombre") String nombreCompleto){
		return "buenas tardes "+ nombreCompleto;
	}
}
