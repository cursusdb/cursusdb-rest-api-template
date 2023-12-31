/*
* CursusDB
* Node.JS Native Client Module
* ******************************************************************
* Copyright (C) 2023 CursusDB
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import net from 'node:net'
import tls from 'tls'

// CursusDB Cluster Client class
class Client {
    constructor(host, port, username, password, tls) {
            this.host = host;
            this.port = port;
            this.username = username;
            this.password = password;
            this.tls = tls;
    }

    Connect() {
        return new Promise((resolve, reject) => {
            if(this.tls) {
                this.socket = tls.connect({ host: this.host, port: this.port }, () => {
                    this.socket.write("Authentication: " + Buffer.from( this.username + "\\0" +  this.password).toString('base64') +"\r\n");
        
                        this.socket.once('data', function (data) {
                            if (data.toString().startsWith("0")) {
                                resolve("Connected to CursusDB cluster successfully.")
                            } else {
                                reject(data.toString())
                            }
                        });
                });
            } else {
                this.socket = net.createConnection({ host: this.host, port: this.port }, () => {
                    this.socket.write("Authentication: " + Buffer.from( this.username + "\\0" +  this.password).toString('base64') +"\r\n");
        
                        this.socket.once('data', function (data) {
                            if (data.toString().startsWith("0")) {
                                resolve("Connected to CursusDB cluster successfully.")
                            } else {
                                reject(data.toString())
                            }
                        });
                });
            }
       
    })
    }
    
    Query(queryString) {
        return new Promise((resolve, reject) => {
            this.socket.write(queryString +"\r\n");

            this.socket.once('data', function (data) {
                resolve(data.toString())
            });

        })
    }

    Close() {
        this.socket.end()
    }

}


export default Client