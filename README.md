# node-red-contrib-db2-for-i
![Platform Node-RED](https://img.shields.io/badge/Platform-Node--RED-red.png)
[![NPM download](https://img.shields.io/npm/dt/node-red-contrib-db2-for-i.svg)](https://npm-stat.com/charts.html?package=node-red-contrib-db2-for-i&from=2017-07-01&to=2022-12-14)

A <a href="http://nodered.org" target="_new">Node-RED</a> node to read and write to a Db2 for i database from Node-RED on IBM i.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

``` bash
npm install node-red-contrib-db2-for-i
```

Prerequisites
-------
1) install Node.js on IBM i (version 10 and later). 

2) install the DB2 for i native driver for Node.js **idb-connector** . 

As a NPM dependency, this driver should be automatically installed when installing the Db2 for i node package. If not the case, please install it manually using the command below:

 ```bash
    npm install idb-connector
 ```
NB: This node has to run on Node.js / Node-RED on IBM i (Native driver). For accessing IBM i from Node-RED running outside IBM i, the alternative is to use this [ODBC node](https://www.npmjs.com/package/node-red-contrib-odbc).

Usage
-----

Allows basic access to a Db2 for i database. Supported queries: SQL SELECT, INSERT, UPDATE, DELETE.

- `msg.payload` must hold the query for the database
-  the result is returned in `msg.payload`.

2 modes for the returned payload : 
-  one row per result message (Default). For processing a row at a time in a Node-RED flow. 
-  Standard "Single Array Mode":  result payload is an array containing all the result rows. 

If nothing is found then null is returned.

Examples
-----
- Refer to the [IBMi-OSS-Examples git page](https://github.com/IBM/ibmi-oss-examples/tree/master/nodejs/node-red)
- Basic Example [here](https://flows.nodered.org/flow/b255f32b8e07a5cc0c17e654fd338354)  or [here](https://flows.nodered.org) - "db2" search to get an up to date example

- Create a set of (CRUD) Web Services (RESTful)  from a Db2 table in a few minutes using this [flow](https://flows.nodered.org/flow/f50b02fb34d3e5fd58cfa271f0c1cdc8) 

- A complete tutorial is available on the [IBM Cloud and Watson Day Web Site](https://ibmcloud-watson-day.mybluemix.net/files/Lab.Node-RED-SocialDashboard.pdf)

- Get Started with Node-RED and Watson [here](https://ibmcloud-watson-day.mybluemix.net) and install Node-RED on IBM i using this [tutorial](https://developer.ibm.com/tutorials/i-running-node-red) 

Usage Details
--------

Input:   `msg.payload`  = SQL Query injected (SELECT, INSERT, UPDATE, DELETE)

Input (OPTIONAL since v0.0.8): The `msg.database` payload for injecting the connection name (ex: Connection1) which has to exist as a DB2 for i config node. 
The  associated DB2 config node name is used as a connection name for connection reuse within a Node-RED flow. 
Useful for dynamic connection selection (Named Connection Pool like) 

Db2 Config Node:  Enter the connection name (ex Connection1), database name(ex dbname = *LOCAL), optional (since version 0.0.8):  your credentials (user profile and password). If no user password specified, use the current user profile.

Output Result in `msg.payload`. 

The returned payload will be an array (JSON Array) containing the result rows (array mode) or one message payload (JSON object) per row (default mode).

If nothing is found then <i>null</i> is returned.

Node-RED on IBM i Quick Start Guide
------

**1) Install Node-red Prerequisites on IBM i**

This section does not replace official documentations. Please refer to this [article on IBM Developer](https://developer.ibm.com/tutorials/i-running-node-red/).  Note also that Node-RED can be installed in a Chroot (IFS Jail) for better isolation.

```bash
bash-5.1$ yum install nodejs16.ppc64
bash-5.1$ yum install gcc
bash-5.1$ system “ADDENVVAR ENVVAR(QIBM_MULTI_THREADED) VALUE(Y) LEVEL(*SYS)” 
 ```
**2) Install Node-red – GLOBAL (aka System-wide)**

```bash 
bash-5.1$ npm install -g node-red

bash-5.1$ npm list --location=global
/QOpenSys/pkgs/lib/nodejs16/lib
├── corepack@0.10.0
├── node-red@3.0.2
└── npm@8.11.0
 ```
 
**3) Install node-red Db2 for i package (LOCAL, in ~/.node-red)**
```bash
cd $HOME/.node-red
npm i idb-connector
npm install node-red-contrib-db2-for-i
``` 
Note : idb-connector is normally installed when installing the db2 node
 
```bash
bash-5.1$ npm list
node-red-project@0.0.1 /home/<USER>/.node-red
├── idb-connector@1.2.16
└── node-red-contrib-db2-for-i@0.2.1
````
 
**4) Start Node-red**
```bash
bash-5.1$ cd /QOpenSys/pkgs/lib/nodejs16/lib/node_modules/node-red/
bash-5.1$ node  red.js 
``` 
**5) Optional – Run Node-red as a background process**
```bash 
bash-5.1$ ln -s /QOpenSys/pkgs/lib/nodejs16/lib/node_modules/node-red/bin/node-red-pi /usr/bin/node-red 
bash-5.1$ node-red 
bash-5.1$ system "SBMJOB CMD(QSH CMD('node-red')) JOB(NODERED)"
CPC1221: Job 059446/<USER>/NODERED submitted to job queue QBATCH in library QGPL.
```
    
## Install the DB2 for i node on older IBM i versions (Node version<=6, 5733OPS) 
You need to install version 0.1.4 of this package using the following command:  

    npm install node-red-contrib-db2-for-i@0.1.4
	
In that case, 5733OPS has to be installed with appropriate options for Node.js v6 and Db2 for i driver located in the default directory:  `/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a` 



