package webgis;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import webgis.utils.IOUtil;

/**
 * HTTPWebGISFileDownload class.
 * 
 * @author Tobia di Pisa
 *
 */
public class HTTPWebGISFileDownload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = -138662992151524493L;	
	
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
			e.printStackTrace();
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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException, IOException {
							
			String temp = this.props.getProperty("temp");
			int buffSize = Integer.valueOf(this.props.getProperty("bufferSize"));
			
			File tempDir = new File(temp);
			if (!tempDir.exists()){
				if(!tempDir.mkdir())
					throw new IOException("Unable to create temporary directory " + tempDir);
			}
			
			InputStream is  = request.getInputStream();
			
			long nanoTime = System.nanoTime();
			//File contextDir = new File(temp ,"context" + nanoTime);
			
			/*
			if (!contextDir.exists()){
				if(!contextDir.mkdir())
					throw new IOException("Unable to create context directory " + contextDir);
			}
			*/
			
			String fileName= "context"+nanoTime+".map";
			IOUtil.stream2localfile(is, fileName, tempDir);

			String downloadUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + 
				request.getContextPath() + "/temp/" + fileName;
			
			ServletContext ctx = getServletContext();
			
			String filePath = temp + "/" + fileName;
			
			/*
			IOUtil.zipDirectory(contextDir.getAbsolutePath(), 
					temp + File.separatorChar + "context" + nanoTime + ".zip", buffSize);	
			
			
			String downloadUrl = "http://" + request.getServerName() + ":" + request.getServerPort() + 
				request.getContextPath() + "/temp/context" + nanoTime + ".zip";
		
		    boolean success = IOUtil.deleteDirectory(contextDir);
		    
		    if (success){
		    	if(LOGGER.isLoggable(Level.INFO))
		    		LOGGER.log(Level.INFO,"Context directory deleted");
		    }else{
		    	if(LOGGER.isLoggable(Level.INFO))
		    		LOGGER.log(Level.INFO,"Context directory not deleted");
		    }
		    */

		    //response.setContentType("text/plain");
			
		    response.setContentType("application/x-download");
		    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
		    
		    PrintWriter  out = response.getWriter();
		    out.print(downloadUrl);
		    
		    //returnFile(filePath, out);  
			
			out.flush();
			out.close();
	}
	
	public static void returnFile(String filename, Writer out)
			throws FileNotFoundException, IOException {
		Reader in = null;
		try {
			in = new BufferedReader(new FileReader(filename));
			char[] buf = new char[4 * 1024]; // 4K char buffer
			int charsRead;
			while ((charsRead = in.read(buf)) != -1) {
				out.write(buf, 0, charsRead);
			}
		} finally {
			if (in != null)
				in.close();
		}
	}
	
}	

