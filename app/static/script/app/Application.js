
/**
 *  this class contains cross-cutting aspects in the current application
 *   eg authentication/authorization, i18n and so on
 */
var Application =  {
	
	name: 'Nurc Gliders',
	version: '1.0',
	config: null,
	init: function( config ){
		this.config = config;
	},
	user: {
		isGuest: function(){
			return ( this.token === null );
		},
		login: function(username, password){
			var auth= 'Basic ' + Base64.encode(username+':'+password);
			Ext.Ajax.request({
	            method: 'GET',
	            url: Application.config.geostoreBaseUrl + 'users/user/details/',
	            scope: this,
	            headers: {
	                'Accept': 'application/json',
	                'Authorization' : auth
	            },
	            success: function(response) {
	                var user = Ext.util.JSON.decode(response.responseText);
					Application.user.token = auth;
					if (user.User){
						Application.user.username = user.User.name;
						Application.user.role = user.User.role;
					}
					if ( this.handlers['login'] ){
						this.handlers['login'].call(this, Application.user);
					}
					
	            },
	            failure: function(response) {
					console.error( response );
	                Application.user.token = null;
					if ( this.handlers['failed'] ){
						this.handlers['failed'].call(this, Application.user);
					}
					
	            }
	        });			
		},
		logout: function(){
			this.username = null;
			this.role = null;
			this.token = null;
			if ( this.handlers['logout'] ){
				this.handlers['logout'].call(this, this);
			}
			
		},
		on: function( action, handler ){
			this.handlers[ action ] = handler;
		},
		username: null,
		role: null,
		token: null,
		handlers: new Object
	}
	
};
