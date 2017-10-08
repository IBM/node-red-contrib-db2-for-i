# node-red-contrib-db2-for-i

A <a href="http://nodered.org" target="_new">Node-RED</a> node to read and write to a Db2 for IBM i database from IBM i.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-db2-for-i


Prereqs
-------
5733OPS Open Source free products with options for Node.js and Db2 for i driver located in /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a (default)


Usage
-----

Allows basic access to a Db2 for i database. Supported queries: SQL SELECT, INSERT, UPDATE, DELETE.

msg.payload must hold the query for the database, and the result is returned in msg.payload.

Typically the returned payload is one row per result message (Default). Useful for processing per row.

NEW -  A more standard "Single Array Mode":  result payload is an array containing all the result rows. Useful for bulk processing.

If nothing is found then null is returned.

Basic Example [here](https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354) 


Usage Details and Example
--------

Input:   msg.payload  = SQL Query injected

Input: The msg.database payload for injecting the db name (ex: *LOCAL). Note: The  associated Template node name is used as a connection name for connection reuse within a Node-RED flow. This node name is used as a connection name.

Input : Enter your credentials in the DB2 for i config node associated with the DB2 for i node : dbname = *LOCAL ,  and user profile and password (should be optional in a next release)

Output Result in msg.payload. Not return code for now...

The returned payload will be an array (JSON Array) containing the result rows (array mode) or one message payload (JSON object) per row (default mode).

If nothing is found then <i>null</i> is returned.


Getting Started
--------

Refer to the flow [here](https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354) 
    

