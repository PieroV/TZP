'use strict';

function get_domrect(METRIC) {
	// quick exits
	let hash, data = {}
	if (!isGecko) {hash = zNA} else if ('9e6f19c5' == mini(oDomRect)) {hash = 'trustworthy'}
	if (undefined !== hash) {
		addBoth(15, METRIC, hash)
		return
	}

	let control = {
		bottom: 120.69999694824219,
		height: 141.41665649414062,
		left: -20.716659545898438,
		right: 120.69999694824219,
		top: -20.716659545898438,
		width: 141.41665649414062,
		x: -20.716659545898438,
		y: -20.716659545898438
	}

	// for each method per key in oDomRect we return either
	// error, trustworthy, or some FPing on the diffs
	// note: errors are already recorded
	sDetail.document[METRIC +'_data'] = {}
	let tmpdata = {}
	let countPass = 0
	for (const k of Object.keys(oDomRect).sort()) {
		sDetail.document[METRIC +'_data'][k] = oDomRect[k]
		let value =''
		if (zErr == k) {value = zErr
		} else if ('642e7ef0' == k) {value = 'trustworthy'; countPass = oDomRect[k]['methods'].length
		} else {
			value = zLIE
			// analyse noise
			let oDiffs = {}, aProps = [], max = 0
			let isNegative = false, isPositive = false
			let test = oDomRect[k]['data']
			for (const p of Object.keys(test)) {
				let diff = control[p] - test[p]
				if (diff > 0) {isPositive = true} else {isNegative = true}
				if (Math.abs(diff) > max) {max = Math.abs(diff)}
				if (0 !== diff) {
					aProps.push(p)
					if (undefined == oDiffs[diff]) {oDiffs[diff] = [p]} else {oDiffs[diff].push(p)}
				}
			}
			let multiples = []
			for (const m of Object.keys(oDiffs)) {
				if (oDiffs[m].length > 1) {multiples.push(oDiffs[m].join(' + '))}
			}
			console.log(k, oDiffs, multiples, max)
			// sign: chamelon seems to always be -, CB seems to always be ±
			let sign =''
			if (isNegative && isPositive) {sign = '±'} else {
				sign = isNegative ? '-' : '+'
			}
			if (max > 0.1) {max = '> '+ sign +'0.1'
			} else {
				// note max is always positive
				var z = -Math.floor(Math.log10(max) + 1) // leading zeros
				// cap at 5: chameleon varies from 6 to 9 in a few tests
				z = z > 5 ? 5 : z
				max = '< '+ sign +'0.' + '0'.repeat(z-1) + '1'
			}
			value = {
				'properties': aProps.length == 8 ? 'all' : aProps.join(', '),
				'range': max,
				'same': (multiples.length ? multiples : 'none'),
				'total': Object.keys(oDiffs).length
			}
		}
		oDomRect[k].methods.forEach(function(method){tmpdata[method] = value})
	}
	let btnData = addButton(15, METRIC +'_data', 'data')
	for (const k of Object.keys(tmpdata).sort()) {data[k] = tmpdata[k]}
	hash = mini(data)
	let btn = addButton(15, METRIC, countPass +'/4')
	addBoth(15, METRIC, hash, btn + btnData, default_red, data)
	return
}

function get_element_keys(METRIC) {
	const id = 'element-key'
	let hash, btn ='', data = [], notation = isTB ? tb_red : '', isLies = false
	try {
		if (runSE) {foo++}
		const element = document.createElement('a')
		element.setAttribute('id', id)
		document.body.appendChild(element)
		let htmlElement = dom[id]
		for (const key in htmlElement) {data.push(key)}
		hash = mini(data); btn = addButton(15, METRIC, data.length)
		// cydec: changes order, removes some keys
			// ToDo: use post constructor when we enumerate all elements
		const aExpected = ['scrollWidth','scrollHeight','clientWidth','clientHeight']
		if ((data.reduce((a, c) => a + aExpected.includes(c), 0)) < aExpected.length) {isLies = true}
		if (isTB) {
			if ('android' == isOS) {
				if ('7766b529' == hash) {notation = tb_green}
			} else {
				// NS 12.1.1 only exposes all the set/value tampering on safer
					// eb81553d: 353 safer
					// 1817fdbe: 340 standard
				if ('eb81553d' == hash || '1817fdbe' == hash) {notation = tb_green}
			}
		}
	} catch (e) {
		hash = e; data = zErrLog
	}
	removeElementFn(id)
	addBoth(15, METRIC, hash, btn, notation, data, isLies)
	return
}

function get_element_font(METRIC) {
	let t0 = nowFn()
	// we only need a few pt values: more than enough to correlate styles
	// but go more in-depth with mono/serif/sans
	// keep in increasing size order
	let sizeA = ['3.9pt','141.7pt','266.6pt',]
	let sizeB = ['3.9pt','xx-small','x-small','small','medium','large','x-large','xx-large','xxx-large','141.7pt','266.6pt']
	let oList = {
		// keep in sorted order
		// https://developer.mozilla.org/en-US/docs/Web/CSS/generic-family
		'cursive': sizeA,
		'emoji': sizeA, // windows: emoji = serif
		'fangsong': sizeA,
		'fantasy': sizeA, // windows: fantasy = sans
		'monospace': sizeB,
		'sans-serif': sizeB,
		'serif': sizeB,
		'system-ui': sizeA,
	}
	//ToDo: each is only 3 extra tests: seem redundant
		// windows: they all = serif
	/*
	'ui-monospace': sizeA,
	'ui-rounded': sizeA,
	'ui-serif': sizeA,
	'ui-sans-serif': sizeA,
	'math': sizeA,
	//*/

	const id = 'element-fp'
	let hash, btn ='', data = {}, range, method
	try {
		const doc = document
		const div = doc.createElement('div')
		div.setAttribute('id', id)
		doc.body.appendChild(div)
		let oData = {}, tmpobj = {}
		for (const k of Object.keys(oList)) {
			let sizes = oList[k]
			let tmpsizes = [], isFirst = 'cursive' == k
			sizes.forEach(function(size) {
				let isTypeCheck = isFirst && size == sizes[0]
				// create + measure each individually as preceeding elements can affect subsequent ones
				dom[id].innerHTML = "<div style='font-size:"+ size +";' class='"+ k +"'>...</div>"
				let target = div.firstChild
				// method
				if (isDomRect > 1) {range = document.createRange(); range.selectNode(target)}
				if (isDomRect < 1) {method = target.getBoundingClientRect() // get a result regardless
				} else if (isDomRect == 1) {method = target.getClientRects()[0]
				} else if (isDomRect == 2) {method = range.getBoundingClientRect()
				} else if (isDomRect > 2) {method = range.getClientRects()[0]
				}
				// width+height = max entropy
				if (isTypeCheck) {
					[method.width, method.height].forEach(function(item) {
						if (runST) {item = isLine ? undefined : '1'}
						let typeCheck = typeFn(item)
						if ('number' !== typeCheck) {throw zErrType + typeCheck}
					})
				}
				tmpsizes.push([size, method.width, method.height])
			})
			let sizehash = mini(tmpsizes)
			if (oData[sizehash] == undefined) {oData[sizehash] = {data: tmpsizes, group: [k]}
			} else {oData[sizehash].group.push(k)}
		}
		// group by styles
		for (const k of Object.keys(oData)){data[oData[k].group.join(' ')] = oData[k].data}
		let count = Object.keys(data).length
		hash = mini(data); btn = addButton(15, METRIC, count +' group'+ (count > 1 ? 's' : ''))
	} catch(e) {
		hash = e; data = zErrLog
	}
	removeElementFn(id)
	addBoth(15, METRIC, hash, btn,'', data, (isDomRect == -1))
	log_perf(15, METRIC, t0)
	return
}

function get_element_forms(METRIC) {
	let t0 = nowFn()
	let hash, btn ='', data = {}, tmpdata = {}, newobj = {}
	let oList = {
		'native': {
			button: '',
			checkbox: '',
			color: '',
			date: '',
			'datetime-local': '',
			details: '<details></details>',
			'details_open': '<details open="">.</details>',
			file: '',
			image: '',
			month: '',
			number: '',
			progress: '<progress></progress>',
			radio: '',
			range: '',
			reset: '',
			select: '<select><option></option></select>',
			select_empty: '<select multiple=""><option></option></select>',
			select_empty_option: '<select multiple=""><option></option></select>',
			select_spaces: '<select multiple=""><option> &nbsp;  &nbsp;  &nbsp; </option>"</select>',
			select_spaces_option: '<select multiple=""><option> &nbsp;  &nbsp;  &nbsp; </option>"</select>',
			select_string: '<select multiple=""><option>Mōá?-&#xffff;</option></select>',
			select_string_option: '<select multiple=""><option>Mōá?-&#xffff;</option></select>',
			submit: '',
			textarea: '<textarea></textarea>',
			textarea_3x5: '<textarea cols="5" rows="3"></textarea>',
			time: '',
			week: '',
			// month + week are same as number but not in chrome | gecko may follow suit
		},
		'unstyled': {
			// differ on windows
			// ToDo: check linux/mac/android
			checkbox: '',
			progress: '<progress></progress>',
			radio: '',
			select: '<select><option></option></select>',
		}
	}
	let width, height, x, y, range, method
	const id = 'element-fp'
	try {
		const doc = document
		const div = doc.createElement('div')
		div.setAttribute('id', id)
		doc.body.appendChild(div)
		let parent = dom[id], isFirst = true
		for (const key of Object.keys(oList)) {
			tmpdata[key] = {}, newobj[key] = {}, data[key] = {}
			for (const k of Object.keys(oList[key])) {
				// important to clear the div so no other elements can affect measurements
				parent.innerHTML =''
				parent.innerHTML = ('' == oList[key][k] ? '<input type="'+ k +'">' : oList[key][k])
				let target = parent.firstChild
				// vertical seems to create subpixels in width before transform
				target.setAttribute('style', 'display:inline; writing-mode: vertical-lr;') 
				if ('unstyled' == key) {target.classList.add('unstyled')}
				if (k.includes('_option')) {target = target.lastElementChild}
				// method
				if (isDomRect > 1) {range = document.createRange(); range.selectNode(target)}
				if (isDomRect < 1) {method = target.getBoundingClientRect() // get a result regardless
				} else if (isDomRect == 1) {method = target.getClientRects()[0]
				} else if (isDomRect == 2) {method = range.getBoundingClientRect()
				} else if (isDomRect > 2) {method = range.getClientRects()[0]
				}
				// typecheck
				let itemdata = [method.width, method.height, method.x, method.y]
				if (isFirst) {
					isFirst = false
					itemdata.forEach(function(item){
						if (runST) {item = null}
						let typeCheck = typeFn(item)
						if ('number' !== typeCheck) {throw zErrType + typeCheck}
					})
				}
				let itemhash = mini(itemdata)
				if (undefined == tmpdata[key][itemhash]) {tmpdata[key][itemhash] = {'data': itemdata, 'group': [k]}
				} else {tmpdata[key][itemhash]['group'].push(k)}
			}
		}
		// group by results
		for (const key of Object.keys(tmpdata)) {
			for (const k of Object.keys(tmpdata[key])) {newobj[key][tmpdata[key][k].group.join(' ')] = tmpdata[key][k]['data']}
		}
		for (const key of Object.keys(newobj)) {
			for (const k of Object.keys(newobj[key]).sort()) {data[key][k] = newobj[key][k]}
		}
		hash = mini(data), btn = addButton(15, METRIC)
	} catch(e) {
		hash = e; data = zErrLog
	}
	removeElementFn(id)
	addBoth(15, METRIC, hash, btn,'', data, (isDomRect == -1))
	log_perf(15, METRIC, t0)
	return
}

function get_element_mathml(METRIC) {
	let t0 = nowFn()
	const id = 'element-fp'
	const sizetype = 'px', sizes = [33,99,111], sizectl = sizes[0]
	let hash, btn ='', data = {}, notation = isTB ? tb_slider_red : '', isLies = isDomRect == -1
	try {
		// create element
		const doc = document
		const div = doc.createElement('div')
		div.setAttribute('id', id)
		doc.body.appendChild(div)

 		let divcontrol = "<div id='mathmldivctrl' style='font-size: "
			+ sizectl + sizetype +";'>x=−b ±b2−4 ac 2a</div>"
		let mathmlstr = "<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo form='prefix'>&minus;</mo>"
		+"<mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&minus;</mo><mn>4</mn>"
		+"<mo>&InvisibleTimes;</mo><mi>a</mi><mo>&InvisibleTimes;</mo><mi>c</mi></msqrt></mrow>"
		+"<mrow><mn>2</mn><mo>&InvisibleTimes;</mo><mi>a</mi></mrow></mfrac></mrow></math>"
		let divcontent =''
		sizes.forEach(function(size) {
			divcontent += "<div id='mathmldiv"+ size +"' style='font-size:"
			+ size + sizetype +";'><span id='mathmlspan"+ size +"'>"+ mathmlstr +"</span></div>"
		})
		doc.getElementById(id).innerHTML = divcontrol + divcontent

		// measure
		let control, width, height
		let rangeC,	rangeW, rangeH
		let targetC = dom['mathmldivctrl'], targetH, targetW
		let isDiff, wType, hType
		sizes.forEach(function(size) {
			targetH = dom['mathmldiv'+size]; targetW = dom['mathmlspan'+size]
			let isCtrlSize = size == sizectl
			size = size + sizetype
			if (isDomRect > 1) {
				// test
				rangeH = document.createRange()
				rangeH.selectNode(targetH)
				rangeW = document.createRange()
				rangeW.selectNode(targetW)
				// control
				if (isCtrlSize) {
					rangeC = document.createRange()
					rangeC.selectNode(targetC)
				}
			}
			if (isDomRect < 1) { // get a result regardless
				if (isCtrlSize) {control = targetC.getBoundingClientRect().height}
				height = targetH.getBoundingClientRect().height
				width = targetW.getBoundingClientRect().width
			} else if (isDomRect == 1) {
				if (isCtrlSize) {control = targetC.getClientRects()[0].height}
				height = targetH.getClientRects()[0].height
				width = targetW.getClientRects()[0].width
			} else if (isDomRect == 2) {
				if (isCtrlSize) {control = targetC.getBoundingClientRect().height}
				height = rangeH.getBoundingClientRect().height
				width = rangeW.getBoundingClientRect().width
			} else if (isDomRect > 2) {
				if (isCtrlSize) {control = targetC.getClientRects()[0].height}
				height = rangeH.getClientRects()[0].height
				width = rangeW.getClientRects()[0].width
			}
			// first item check/diff
			if (isCtrlSize) {
				if (runST) {width = {}, height = ' '}
				wType = typeFn(width); hType = typeFn(height)
				if ('number' !== wType || 'number' !== hType) {
					throw zErrType + (wType == hType ? wType : wType +' x '+ hType)
				}
				isDiff = height - control
			}
			data[size] = [width, height]
		})
		let displayEnabled =''
		let isEnabled = Math.abs(isDiff) > 0.001
		if (!isSmart || !isLies) {
			data['enabled'] = isEnabled
			displayEnabled = ' ['+ (isEnabled ? zE : zD) +']'
		}
		if (isTB) {notation = isEnabled ? tb_standard : tb_safer}
		hash = mini(data); btn = addButton(15, METRIC) + displayEnabled
	} catch(e) {
		hash = e; data = zErrLog
	}
	removeElementFn(id)
	addBoth(15, METRIC, hash, btn, notation, data, isLies)
	log_perf(15, METRIC, t0)
	return
}

const outputElements = () => new Promise(resolve => {
	Promise.all([
		get_domrect('domrect'),
		get_element_font('element_font'),
		get_element_keys('htmlelement_keys'),
		get_element_forms('element_forms'),
		get_element_mathml('element_mathml'),
	]).then(function(){
		return resolve()
	})
})

countJS(15)
