package co.edu.udea.iw.ws.dto;

import javax.xml.bind.annotation.XmlRootElement;

import co.edu.udea.iw.dto.Rol;
/**
 * Clase dto auxiliar para mostrar los datos de un Usuario en el Web Service.
 * @author Santiago G�mez Giraldo
 * @version 1
 * @category DTO
 */
@XmlRootElement
public class UsuarioDtoWs {
		/**
		 * Correo del usuario
		 */
		private String correo;
		/**
		 * Cedula del usuario
		 */
		private String cedula;
		/**
		 * Nombre del usuario
		 */
		private String nombre;
		/**
		 * Apedllido del usuario
		 */
		private String apellido;
		
		private Rol rol;
	
		
		/**
		 * Getters y Setters de usuario
		 */
		public String getCorreo() {
			return correo;
		}
		public void setCorreo(String correo) {
			this.correo = correo;
		}
		public String getCedula() {
			return cedula;
		}
		public void setCedula(String cedula) {
			this.cedula = cedula;
		}
		public String getNombre() {
			return nombre;
		}
		public void setNombre(String nombre) {
			this.nombre = nombre;
		}
		public String getApellido() {
			return apellido;
		}
		public void setApellido(String apellido) {
			this.apellido = apellido;
		}
		/**
		 * @return the rol
		 */
		public Rol getRol() {
			return rol;
		}
		/**
		 * @param rol the rol to set
		 */
		public void setRol(Rol rol) {
			this.rol = rol;
		}

		

}
