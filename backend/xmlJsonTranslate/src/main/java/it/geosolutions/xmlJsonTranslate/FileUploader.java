package it.geosolutions.xmlJsonTranslate;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter; 
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class FileUploader
 */
public class FileUploader extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private final static String PROPERTY_FILE_PARAM = "app.properties";
	private final static Logger LOGGER = Logger.getLogger(FileUploader.class.getSimpleName());
	private Properties properties = new Properties();
	private String tempDirectory;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public FileUploader() {
        super();
    }
    
    public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
		String appPropertyFile = getServletContext().getInitParameter(PROPERTY_FILE_PARAM); 
		InputStream inputStream = getServletContext().getResourceAsStream(appPropertyFile);	
		try {
			properties.load(inputStream);
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE)){
				LOGGER.log(Level.SEVERE, "Error encountered while processing properties file", e);
			}
		} 	finally {
				try {
					if (inputStream != null)
						inputStream.close();
				} catch (IOException e) {
					if (LOGGER.isLoggable(Level.SEVERE))
						LOGGER.log(Level.SEVERE,
								"Error building the proxy configuration ", e);
					throw new ServletException(e.getMessage());
				}
			}
		// get the file name for the temporary directory
		String temp = properties.getProperty("temp");
		
		// if it does not exists create the file
		tempDirectory = temp;
		File tempDir = new File(temp);
		if (!tempDir.exists()){
			if(!tempDir.mkdir()){
				LOGGER.log(Level.SEVERE, "Unable to create temporary directory " + tempDir);
				throw new ServletException("Unable to create temporary directory " + tempDir);
			}
				
		}
		
    }

	/**
	 * read the content of a file and delete it
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// get parameter name
		String code = request.getParameter("code");
		
		if (code != null){
			
			File file = null;
			BufferedReader br = null;
			PrintWriter writer = null;
			try{
				// get file
				file = new File(tempDirectory + "/" + code);
				br = new BufferedReader( new FileReader( file ));
			    writer = response.getWriter();
			    String line = null;
			    while( (line=br.readLine()) != null ){
			    	writer.println( line );
			    }
			    // delete file
			    file.delete();
			} catch(IOException ex){
				if (LOGGER.isLoggable(Level.SEVERE)){
					LOGGER.log(Level.SEVERE,
								"Error encountered while downloading file");
				}
				response.setContentType("text/html");
				writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );				
			} finally {
				br.close();
				writer.close();
			}

		} else {
			if (LOGGER.isLoggable(Level.SEVERE)){
				LOGGER.log(Level.SEVERE,
							"malformed request: code param is required");
			}
			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\"malformed request: code param is required\"}" );
		}

	}

	/**
	 * read and save on file the content of post request
	 * return a json where the name of the file is returned
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		BufferedReader in = null;
		BufferedWriter out = null;
		try{
			// read the content data for this request
			in = new BufferedReader(
									new InputStreamReader( 
											request.getInputStream()) );
			// create a file with a random name

			String uuid = UUID.randomUUID().toString();
			out = new BufferedWriter(new FileWriter( tempDirectory + "/" + uuid ));

			StringBuffer sb = new StringBuffer();
			String line = null;
			while ( (line=in.readLine()) != null ){
				sb.append( line );
			}
			
			String input = clean( sb.toString() );
			
			
			out.write( input );

		    response.setContentType("text/html");	        
			writeResponse(response, "{ \"success\":true, \"result\":{ \"code\":\""+ uuid +"\"}}");
		} catch (IOException ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
							"Error encountered while uploading file");

			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );
		

		} finally {
			if ( in != null ){
				in.close();
			}
			if ( out != null ){
				out.close();
			}
		}

	}
	
	/**
	 *  trim multipart header and footer created by html form
	 *
	 *   -----------------------------20691717242189857501854012939Content-Disposition: form-data; name="file"; filename="Trentino.kml"Content-Type: application/vnd.google-earth.kml+xml
	 *   -----------------------------206917172421... 
	 *
	 *
	 */
	private String clean(String input){
		String start = "<kml";
		String end = "</kml>";
		return input.substring( input.indexOf( start ), input.lastIndexOf(end)+end.length() );
	}
	
	private void writeResponse(HttpServletResponse response, String text)
			throws IOException {
		PrintWriter writer = null;
		try {
			writer = response.getWriter();
			writer.write( text );
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE, e.getMessage());
		} finally {
			if (writer != null) {
				writer.flush();
				writer.close();
			}
		}
	}	

}
