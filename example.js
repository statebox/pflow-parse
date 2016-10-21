const loadNet = require('./parse.js')
const fs = require('fs')

//var fn = './producer-consumer.pflow'
const fn = process.argv[2]
if (!fn) {
	console.log('usage: node example.js [FILENAME.pflow]')
} else {
fs.readFile(fn, {encoding: 'utf8'},
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
}
