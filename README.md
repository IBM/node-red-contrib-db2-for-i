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

The returned payload will be an array of the result rows.

If nothing is found for the key then <i>null</i> is returned.


Getting Started
--------

Refer to the flow   https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354
    

