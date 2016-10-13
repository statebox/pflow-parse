import loadNet from './parse.js'
import fs from 'fs'

//var fn = './producer-consumer.pflow'
fs.readFile('./split.pflow', {encoding: 'utf8'},
	function loadXML (err, xml) {
		if (err) {
			callback(err)
		} else {
			loadNet(xml, function (err, net) {
				if (err) {
					console.error(err)
				} else {
					console.log(JSON.stringify(net))
				}
			})
		}
	}
)
