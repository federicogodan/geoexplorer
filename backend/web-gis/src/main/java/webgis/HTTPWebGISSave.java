package webgis;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.Writer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSON;
import net.sf.json.JSONSerializer;
import net.sf.json.xml.XMLSerializer;

import org.apache.commons.io.IOUtils;
import org.apache.xml.serialize.OutputFormat;
import org.w3c.dom.Document;

import webgis.utils.Utilities;


/**
 * HTTPWebGISSave class.
 * 
 * @author Tobia di Pisa
 *
 */
public class HTTPWebGISSave extends HttpServlet {
	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Initialize the <code>ProxyServlet</code>
	 * @param servletConfig The Servlet configuration passed in by the servlet conatiner
	 */
	public void init(ServletConfig servletConfig) {
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
	 *                             we response to the client 
	 */
	public void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
        	throws IOException, ServletException {
		
		InputStream is  = httpServletRequest.getInputStream();
		
        String jsonData = IOUtils.toString(is);

        XMLSerializer serializer = new XMLSerializer(); 
        JSON json = JSONSerializer.toJSON( jsonData ); 
        String xml = serializer.write( json );  
		
		Document document = Utilities.parseXmlFile(xml);
		
		//put FDH before all sources
		try{
			Utilities.putAtFirst(document,"sources","fdh");
		
		}catch(Exception e){ 
			
			System.out.print("Unable to move fdh at first\nERROR:");
			System.out.print(e.toString());
		}

		
        OutputFormat format = new OutputFormat(document);
        format.setLineWidth(65);
        format.setIndenting(true);
        format.setIndent(2);
        Writer out = new StringWriter();
        org.apache.xml.serialize.XMLSerializer xmlSerializer = new org.apache.xml.serialize.XMLSerializer(out, format);
        xmlSerializer.serialize(document);
        
        httpServletResponse.setContentType("text/plain");
        httpServletResponse.getWriter().println(out);
        
    }

    
   
}
