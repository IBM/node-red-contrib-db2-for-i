/**
 * Copyright 2017 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/   

 module.exports = function(RED) {    
        //"use strict"; 
        // Promise was used in node-red-contrib-db2fori version <= 0.1.4
        //####var Promise = require('promise');
        // Requires native DB2 driver - non blocking version : Node-RED flow has to run locally on IBM i, for now. JDBC/ODBC driver use to come.
        // Hardcoded path..todo: make it more flexible
        // This was valid for in node-red-contrib-db2fori version <= 0.1.4 which uses 5733OPS - 0.1.5 uses the npm way and Node v8+ 
        //####new in version 0.1.5 var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');
        //####use of idb-connector instead. Thanks to @ibmrcruicks 
        var db = require('idb-connector');
	//var odbc = require('odbc'); 
        // Keep-Alive timeout of reconnect time. Keeping a connection for performance. If keepAlive=false, connect-query-disconnect mode. 
        var db2foriKeepAliveTimout = RED.settings.db2foriKeepAliveTimout || 1800000;  //default: 30 minutes
         
        function ibmdb2foriNode(n) {
            RED.nodes.createNode(this,n);
            this.connected = false;
            this.connecting = false;
            this.cnnname=n.cnnname;           
            this.dbname = n.db;
            this.dbconn=n.dbconn;
            this.connectionTime = 0;
            this.keepalive=n.keepalive;
            var node = this;
                      
            function doConnect(conncb) {
                node.connecting = true;
                
                node.emit("state","connecting");
                node.conn = {};
                this.dbconn = new db.dbconn();
                     // Connection to the DB. will be reused by other nodes if needed 
                      if ( (node.credentials.user == null  &&  node.credentials.password == null) || (node.credentials.user == ''  &&  node.credentials.password == '')  )
                           {
                             this.dbconn.conn(node.dbname);
                             node.debug("No user/password specified: Connecting with current user profile" );  
                           }
                        else{
                            this.dbconn.conn(node.dbname, node.credentials.user, node.credentials.password); 
                            node.debug("Connecting with specified user profile" );  
                        }
                        node.dbconn = this.dbconn;
                        node.connected = true;
                        node.connectionTime = new Date().getTime();
                        node.trace("connectionTime== " + node.connectionTime+" with "+this.dbconn);
             
            }

            
                
            
            this.connect = function() {
                            
                        doConnect();
                                  
                    }
            
              
            
            this.on('close', function (done) {
                if (this.connection) {
                    //node.connection.end(this.dbconn);
                      //before  0.1.5 : this.dbconn.close();
                  this.dbconn.disconn();
                      //after 0.1.5 
                  this.dbconn.close();  
                  delete this.dbconn;

                } 
                done();
            });
        }

        RED.nodes.registerType("DB2 for i Config", ibmdb2foriNode, {
            credentials: {
                user: {type: "text"},
                password: {type: "password"}
            }
        });

        function ibmdb2foriNodeIn(n) {

            RED.nodes.createNode(this,n);
            this.mydb = n.mydb;
            this.arraymode = n.arraymode;
            var node = this;
            this.status({fill:"red",shape:"ring",text:"disconnected"});
            
            node.query = function(node, db2, msg){
               
		// status below never displayed - synchronous task vs rendering...need to dig futher     
                this.status({fill:"blue",shape:"dot",text:"processing..."});

                if ( msg.payload !== null && typeof msg.payload === 'string' && msg.payload !== '') {
                    
                    //node.debug("Processing SQL Query with "+ db2.dbconn+ " "+msg.payload);
                    try{
                       var sqlB = new db.dbstmt(db2.dbconn);
                   
                        
                    // sqlB.execSync(msg.payload, function(rows) {
                    sqlB.execSync(msg.payload, function(rows, error) { // 20200204/NEDI: "error" added for retrieving errors from SQL-processor
                        
						if (error) { throw(error) } // 20200204/NEDI: "error" added for retrieving errors from SQL-processor

                          
                    if (!node.arraymode)        
                        {   
			if (rows == null) { rows = []}; // 20200204/NEDI: added for error while using for INSERT
                            rows = rows.length==0?[""]:rows; //issue 0.1.1 - if rows is empty, return an empty row
                            rows.forEach(function(row) {
                                
                                msg.payload=row;
                                node.send(msg);
                                // bug - erase msg content corrected 0.0.9 - node.send({ topic: msg.topic, payload: row } );
                                
                            })
                        }
                        else
                        {
                            msg.payload=rows;
                            node.send(msg);
                 
                        }
                            
                        //node.send([ null, { topic: msg.topic, control: 'end' }]);
                      
                    });
                      
                      }
                     
                    catch(e)
                        {
							 msg.payload=e.message; // 20200204/NEDI: added for error handling
                             node.debug("Error or Warning while executing a DB statement: exec() "+e.message);
                             node.error("Error or Warning while executing a DB statement: exec() "+e.message, msg); // 20200204/NEDI: inserted ", msg" for error handling
                             //db2.dbconn=null;
                            
                        } 
                    
                      if (sqlB) {
                          sqlB.close();   
                      } 
                      delete sqlB;

	             // the node is connected, let's display its status 		
                     this.status({fill:"green",shape:"dot",text:"connected "+ db2.cnnname});
                     
	             // do we need to close the connection after this latest query (keepalive off or max time reached)? 
		// if so , close the connection, and update the node status with a specific 'green disconnected' status 		
                     var time = new Date().getTime();  
                    if (!db2.keepalive || ( time-db2.connectionTime >= db2foriKeepAliveTimout )  ){   // 60 secondes
                                
                            // before version 0.1.5 
			    //db2.dbconn.close();
                            db2.dbconn.disconn(); // bug with disconn(), close() API error. To be fixed for QUSER/QSQSRVR jobs cleanup
                            // after version 0.1.5
		            db2.dbconn.close();	  
                            delete db2.dbconn;
                            db2.dbconn=null;
                            //node.debug("Disconnection forced: "+db2.cnnname+" elapsed time:"+ (time-db2.connectionTime)/1000 + "- timeout: "+db2foriKeepAliveTimout/1000+" seconds"  );
			    node.status({fill:"green",shape:"ring",text:"disconnected "+ db2.cnnname});
                                                     
                        }
                        time=null;
                /*    }
                     
                    catch(e)
                        {
                             node.debug("Error while executing a DB statement...");
                             node.error("Error while executing a DB statement...");
                             //db2.dbconn=null;
                            
                        }  */
                    }
                else {
                    if (msg.payload === null) { 
                        node.error("msg.payload : the query is not defined");
                    }
                    if (typeof msg.payload !== 'string') { 
                        node.error("msg.payload : the query is not defined as a string");
                    }
                    if (typeof msg.payload === 'string' && msg.payload === '') { 
                        node.error("msg.payload : the query string is empty");
                    }
                }
                    
            }
            //node.on("input", (msg) => {
              this.on('input', function(msg){ 

                if ( msg.database == null ) {
                     // Simple mode - when you don't specify a connection name dynamically in msg.database - use the one in the Db2 for i config node attached.
                    msg.database ="simple-mode";          
                 }
                
                node.mydbNode = RED.nodes.getNode(n.mydb);
                    
                    //if a node config already there
                    if (node.mydbNode) {

                       node.send([ null, { control: 'start', query: msg.payload, database: n.mydb } ]);
                        // if a connection already exists to this particular "database". for connection reuse. not pooling yet :)
                        
                      var findNode;
                      RED.nodes.eachNode((node)=>{
                                
                       if(node.cnnname && node.cnnname === msg.database){
                                      findNode = RED.nodes.getNode(node.id);
                                      node.mydb = node.id;
                                      node.debug("Connection name specified in msg.database. Connection using Db2 Config node : "+ node.cnnname);
                                }
                            })
                      
                        if (findNode == null && msg.database!=null && msg.database !="simple-mode")
                                {
                                    node.error("msg.database is not matching any Connection Name in a Db2 for i config node");
                                    this.status({fill:"red",shape:"ring",text:"disconnected"});
                                }
                        else
                            {
                        if (findNode == null)
                                { 
                                  findNode = RED.nodes.getNode(n.mydb);
                                   node.debug("Simple Mode. Connection using Db2 Config node : "+ findNode.cnnname );
                                }
                                                
                        
                        if( findNode.dbconn && ( findNode.cnnname === msg.database || msg.database =="simple-mode")) {
                            node.debug("Already connected to DB2 for i with this connection : "+ findNode.cnnname);
			    node.query(node, findNode, msg);
                        }
                        // if a connection - or config node - to this particular does not exist: get the appropriate config node & Get a connection with connect() 
                        // if a config node does not exist for this system and database, fails.
                        else{
                           //we found the config node whose dbname equals the injected input msg.database payload. let's connect for the first time, we'll reuse it. 
                            findNode.connect();
                           // we are connected, let's query our database using the DB2 API exec() 
			    node.query(node, findNode, msg);
                             } 
                            }
                        
                    }
                    else {
                        this.error("database not configured");
                        this.status({fill:"red",shape:"ring",text:"disconnected"});
                    }
          
            });
        }
        RED.nodes.registerType("DB2 for i", ibmdb2foriNodeIn);
    }
