# node-red-contrib-db2-for-i

A <a href="http://nodered.org" target="_new">Node-RED</a> node to read and write to a Db2 for i database from Node-RED on IBM i.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-db2-for-i


Prereqs
-------
- If you use 5733OPS and Node version <=6 :
5733OPS Open Source free products with options for Node.js and Db2 for i driver located in /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a (default)
- If you use the latest package version : 
Since node-red-contrib-db2-for-i version >= 0.1.5, 5733OPS is not used anymore (deprecated): the prereq is to install the Node.js iDB Connector idb-connector (done automatically when installing this package if not already present)
  

Usage
-----

Allows basic access to a Db2 for i database. Supported queries: SQL SELECT, INSERT, UPDATE, DELETE.

msg.payload must hold the query for the database, and the result is returned in msg.payload.

The returned payload is one row per result message (Default). Useful for processing per row.

NEW -  A more standard "Single Array Mode":  result payload is an array containing all the result rows. Useful for bulk processing.

If nothing is found then null is returned.

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
    

