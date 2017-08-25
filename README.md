# node-red-contrib-db2-for-i

A <a href="http://nodered.org" target="_new">Node-RED</a> node to read and write to a DB2 for IBM i database from IBM i.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-db2-for-i


Prereqs 
-------
5733OPS Open Source free products with options for Node.js and DB2 driver located in /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a 


Usage
-----

Allows basic access to a DB2 for i database.

The `msg.database` must hold the <i>database</i>

The `msg.topic` must hold the <i>query</i>

and the result is returned in `msg.payload`.

Each row will send a new payload, so you can work with big results.

Typically the returned payload will be an array of the result rows.

If nothing is found for the key then <i>null</i> is returned.

