# node-red-contrib-db2-for-i

A <a href="http://nodered.org" target="_new">Node-RED</a> node to read and write to a Db2 for i database from Node-RED on IBM i.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-db2-for-i


Prereqs
-------
- If you use the latest package version (>=0.1.5)  :
5733OPS is not used anymore (Deprecated): the prereq is to install the Node.js iDB Connector idb-connector (done automatically when installing this package if not
 already present) with Node.js (version 8 and later) using a yum install.

- If you use 5733OPS and Node version <=6 (Deprecated), you need to install version 0.1.4 of this package using the following command:  
    npm install node-red-contrib-db2-for-i@0.1.4

5733OPS has to be installed with appropriate options for Node.js v6 and Db2 for i driver located in /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a (default)

Usage
-----

Allows basic access to a Db2 for i database. Supported queries: SQL SELECT, INSERT, UPDATE, DELETE.

msg.payload must hold the query for the database, and the result is returned in msg.payload.

The returned payload is one row per result message (Default). Useful for processing per row.

NEW -  A more standard "Single Array Mode":  result payload is an array containing all the result rows. Useful for bulk processing.

If nothing is found then null is returned.

A complete tutorial is available on the [IBM Cloud and Watson Day Web Site] (https://ibmcloud-watson-day.mybluemix.net/files/Lab.Node-RED-SocialDashboard.pdf)

Basic Example [here](https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354)  or [here](https://flows.nodered.org) - "db2" search to get an up to date example

Usage Details and Example
--------

Input:   msg.payload  = SQL Query injected (SELECT, INSERT, UPDATE, DELETE)

Input (OPTIONAL since v0.0.8): The msg.database payload for injecting the connection name (ex: Connection1) which has to exist as a DB2 for i config node. 
The  associated DB2 config node name is used as a connection name for connection reuse within a Node-RED flow. 
Useful for dynamic connection selection (Named Connection Pool like) 

Db2 Config Node:  Enter the connection name (ex Connection1), database name(ex dbname = *LOCAL), optional (since version 0.0.8):  your credentials (user profile and password). If no user password specified, use the current user profile.

Output Result in msg.payload. 

The returned payload will be an array (JSON Array) containing the result rows (array mode) or one message payload (JSON object) per row (default mode).

If nothing is found then <i>null</i> is returned.

 
Getting Started
--------

Refer to the flow [here](https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354)  or [here](https://flows.nodered.org) - "db2" search to get an up to date example
    
A complete tutorial is available on the [IBM Cloud and Watson Day Web Site] (https://ibmcloud-watson-day.mybluemix.net/files/Lab.Node-RED-SocialDashboard.pdf)

Get Started with Node-RED and Watson [here] (https://ibmcloud-watson-day.mybluemix.net) and install Node-RED on IBM i using this [tutorial] (https://developer.ibm.com/tutorials/i-running-node-red) 
