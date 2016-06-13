package co.edu.udea.iw.ws.dto;

import javax.xml.bind.annotation.XmlRootElement;

import co.edu.udea.iw.dto.SolicitudId;

@XmlRootElement
public class SolicitudDTOWS {
	private SolicitudId id;
	private int estadoSolicitud;
	public SolicitudId getId() {
		return id;
	}
	public void setId(SolicitudId id) {
		this.id = id;
	}
	public int getEstadoSolicitud() {
		return estadoSolicitud;
	}
	public void setEstadoSolicitud(int estadoSolicitud) {
		this.estadoSolicitud = estadoSolicitud;
	}
	
	
}
