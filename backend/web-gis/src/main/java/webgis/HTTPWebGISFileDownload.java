package webgis;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import webgis.utils.IOUtil;

/**
 * HTTPWebGISFileDownload class.
 * 
 * @author Tobia di Pisa
 * @author Lorenzo Natali
 *
 */
public class HTTPWebGISFileDownload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = -138662992151524493L;	
	
	//private final static Logger LOGGER = Logger.getLogger(HTTPWebGISFileDownload.class.toString());
	
	private Properties props;

	/**
	 * Initialize the <code>ProxyServlet</code>
	 * @param servletConfig The Servlet configuration passed in by the servlet container
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
	 *                             
	 * Used for download a file saved from the temp directory
	 */
	public void doGet (HttpServletRequest request, HttpServletResponse response)
	throws IOException, ServletException {
		
		String fileName=(String) request.getParameter("file");
		String temp = this.props.getProperty("temp");
		String filePath = temp + "/" + fileName;
		
		response.setContentType("application/force-download");
	    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
	    PrintWriter  out = response.getWriter();
	    returnFile(filePath, out);  
	    //---------------
	    //--Delete file--
	    //---------------
	    
	    // Make sure the file or directory exists and isn't write protected
	    File f=new File(filePath);
	    if (!f.exists()){
	      throw new IllegalArgumentException("Delete: no such file or directory: " + fileName);
	    }
	    if (!f.canWrite()){
	      throw new IllegalArgumentException("Delete: write protected: " + fileName);
	    }
	    // Attempt to delete it
	    boolean success = f.delete();
	    if (!success){
	      throw new IllegalArgumentException("Delete: deletion failed");
	 
	    }
		
		
	}

	/**
	 * Performs an HTTP POST request
	 * @param httpServletRequest The {@link HttpServletRequest} object passed
	 *                            in by the servlet engine representing the
	 *                            client request
	 * @param httpServletResponse The {@link HttpServletResponse} object by which
	 *                             we can response to the client
	 *                             
	 * used to save the xml file in a temp directory.
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException, IOException {
							
			String temp = this.props.getProperty("temp");
			
			File tempDir = new File(temp);
			if (!tempDir.exists()){
				if(!tempDir.mkdir())
					throw new IOException("Unable to create temporary directory " + tempDir);
			}
			
			InputStream is  = request.getInputStream();
			
			long nanoTime = System.nanoTime();
			
			
			String fileName= "context" + nanoTime + ".map";
			IOUtil.stream2localfile(is, fileName, tempDir);
			
		    response.setContentType("text/plain");
			response.setContentType("application/force-download");
		    response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
		    
		    PrintWriter  out = response.getWriter();
		    out.print(fileName);
		    
		    
			
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

