package it.geosolutions;

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
	
	private static final String PROPERTY_FILE = "/WEB-INF/app.properties";
	
	private Logger logger = Logger.getLogger(FileUploader.class.getSimpleName());
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
		InputStream inputStream = getServletContext().getResourceAsStream(PROPERTY_FILE);	
		try {
			properties.load(inputStream);
		} catch (IOException e) {
	    	logger.log(Level.SEVERE, "Error encountered while processing properties file");
		} 
		// get the file name for the temporary directory
		String temp = properties.getProperty("temp");
		
		// if it does not exists create the file
		tempDirectory = temp;
		File tempDir = new File(temp);
		if (!tempDir.exists()){
			if(!tempDir.mkdir()){
				logger.log(Level.SEVERE, "Unable to create temporary directory " + tempDir);
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
		// get file
		File file = new File(tempDirectory + "/" + code);
		BufferedReader br = new BufferedReader( new FileReader( file ));
		// response.setContentType("application/xml");
	    PrintWriter writer = response.getWriter();
	    String line = null;
	    while( (line=br.readLine()) != null ){
	    	writer.println( line );
	    }
	    br.close();
	    // delete file
	    file.delete();
	}

	/**
	 * read and save on file the content of post request
	 * return a json where the name of the file is returned
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// read the content data for this request
		BufferedReader in = new BufferedReader(
								new InputStreamReader( 
										request.getInputStream()) );
		// create a file with a random name
		
		String uuid = UUID.randomUUID().toString();
		BufferedWriter out = new BufferedWriter(new FileWriter( tempDirectory + "/" + uuid ));
	
		// copy stream content to file
		String line = null;
		while ( (line=in.readLine()) != null ){
			out.write( line );
		}
		
		out.close();
		in.close();
		
	    response.setContentType("text/html");	        
	        
		// return file name as response
		// response.setContentType("application/json");
	    PrintWriter writer = response.getWriter();
	    writer.println("{ \"success\":true, \"result\":{ \"code\":\""+ uuid +"\"}}");
	    writer.flush();
	    writer.close();
	}

}
