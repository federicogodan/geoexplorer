package webgis;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.xml.XMLSerializer;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


/**
 * HTTPWebGISFileUpload class.
 * 
 * @author Tobia di Pisa
 *
 */
public class HTTPWebGISXmlUpload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = 2097550601489338403L;
	private final static Logger LOGGER = Logger.getLogger(HTTPWebGISFileDownload.class.toString());
	
	private Properties props;

	/**
	 * Initialize the <code>ProxyServlet</code>
	 * @param servletConfig The Servlet configuration passed in by the servlet conatiner
	 */
	public void init(ServletConfig servletConfig)throws ServletException {
		super.init(servletConfig);
		InputStream inputStream = getServletContext().getResourceAsStream("/WEB-INF/classes/app.properties");
		Properties props = new Properties();
		try {
			props.load(inputStream);
			this.props = props;
		} catch (IOException e) {
	    	if(LOGGER.isLoggable(Level.SEVERE))
	    		LOGGER.log(Level.SEVERE, "Error encountered while processing properties file");
		} 
	}

	/**
	 * Performs an HTTP GET request
	 * @param httpServletRequest The {@link HttpServletRequest} object passed
	 *                            in by the servlet engine representing the
	 *                            client request
	 * @param httpServletResponse The {@link HttpServletResponse} object by which
	 *                             we can response to the client 
	 */
	public void doGet (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
	throws IOException, ServletException {
	}

	/**
	 * Performs an HTTP POST request
	 * @param httpServletRequest The {@link HttpServletRequest} object passed
	 *                            in by the servlet engine representing the
	 *                            client request
	 * @param httpServletResponse The {@link HttpServletResponse} object by which
	 *                             we can response to the client 
	 */
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException, IOException {
		

		try {

			StringBuilder stringBuilder = new StringBuilder();
			BufferedReader bufferedReader = null;
			try {
				InputStream inputStream = request.getInputStream();
				if (inputStream != null) {
					bufferedReader = new BufferedReader(new InputStreamReader(
							inputStream));
					char[] charBuffer = new char[128];
					int bytesRead = -1;
					while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
						stringBuilder.append(charBuffer, 0, bytesRead);
					}
				} else {
					stringBuilder.append("");
				}
			} catch (IOException ex) {
				throw ex;
			} finally {
				if (bufferedReader != null) {
					try {
						bufferedReader.close();
					} catch (IOException ex) {
						throw ex;
					}
				}
			}
			String xml = stringBuilder.toString();

			XMLSerializer xmlSerializer = new XMLSerializer();
			JSON json = xmlSerializer.read(xml);

			response.setContentType("text/html");

			JSONObject jsonObj = new JSONObject();
			jsonObj.put("success", true);
			//jsonObj.put("result", URLEncoder.encode(json.toString(), "UTF-8"));
			jsonObj.put("result", json.toString());

			Writer writer = response.getWriter();
			writer.write(jsonObj.toString());
			writer.flush();
			writer.close();
		
		} catch(Exception ex) {
	    	if(LOGGER.isLoggable(Level.SEVERE))
	    		LOGGER.log(Level.SEVERE,"Error encountered while uploading file");
	    	
	    	response.setContentType("text/html");
	    	
	        JSONObject jsonObj = new JSONObject();
	        jsonObj.put("success", false);
	        jsonObj.put("errorMessage", ex.getLocalizedMessage());
	        
			Writer writer = response.getWriter();
			writer.write(jsonObj.toString());
			writer.flush();
			writer.close();
		}
	}

}	

