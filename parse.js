const parseString = require('xml2js').parseString
const R = require('ramda')

const maphead = R.map(R.head)
const heads = R.compose(maphead, R.head)
const iMap = R.addIndex(R.map)

const squash = R.compose(
	xs => iMap((x, i) => R.assoc('i', i, xs[x]), R.keys(xs)),
	xs => R.map(heads, R.groupBy(R.prop('id'), xs))
)

function reshape (net) {
	// {i: [{j: [x]}} => {i: {j: x}}
	const places = squash(net.place)
	const transitions = squash(net.transition)
	const rawArcs = R.map(maphead, net.arc)

	function parseArc (arc) {
		const s = R.find(R.propEq('id', arc.sourceId))
		const t = R.find(R.propEq('id', arc.destinationId))

		const ps = s(places)
		const pt = t(places)
		const ts = s(transitions)
		const tt = t(transitions)

		if ((ps && pt) || (ts && tt)) {
			throw new Error('illegal arc', arc)
		}

		if (ps && tt) {
			return R.assoc('transition', tt.i, R.objOf('pre', R.of(ps.i)))
		}

		if (ts && pt) {
			return R.assoc('transition', ts.i, R.objOf('post', R.of(pt.i)))
		}

		throw new Error('illegal arc', arc)
	}

	const concatMerge = R.reduce(R.mergeWith(R.concat), {})
	const tdual = R.compose(
		R.map(concatMerge),
		R.map(R.map(R.dissoc('transition'))),
		R.groupBy(R.prop('transition')),
		R.map(parseArc)
	)

	// (1 2)---[t]---(3) => {pre:[1,2],post:[3]}
	const adjacentPlaces = tdual(rawArcs)

	const dropUnused = R.map(R.compose(
		R.dissoc('tokens'), R.dissoc('isStatic'), R.dissoc('i'), R.dissoc('id')
	))

	const T = iMap((x,i) => R.merge(x, adjacentPlaces[i]))

	const toInt = x => x ? parseInt(x, 10) : undefined

	const makeInts = R.map(tr => R.merge(tr, {
		tokens: toInt(tr.tokens),
		id: toInt(tr.id),
		x: toInt(tr.x),
		y: toInt(tr.y)
	}))

	const makeMinimal = R.map(R.compose(dropUnused, makeInts))
	const clean = xs => makeInts(dropUnused(xs))

	const Transitions = T(transitions)

	return {
		places: clean(places),
		transitions: clean(Transitions)
	}
}


module.exports = function loadNet ( pflowFile , callback ) {
	parseString(pflowFile, function (err, result) {
		if (err) {
			callback(err)
		} else {
			var net = result.document.subnet[0]
			var sbxnet = reshape(net)
			callback(null, sbxnet)
		}
	})
}
