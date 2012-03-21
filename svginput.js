function svg_input(holder, database, callback) {
	var W = 320,
		H = 240,
		r = Raphael(holder, W, H),
		values = [],
		len = 27;
	for (var i = len; i--;) {
		if (database[i] != null) {
			values.unshift(database[i]);
		} else
			values.unshift(50);
	}
	function translate(x, y) {
		return [
			50 + (W - 60) / (values.length - 1) * x,
			H - 10 - (H - 20) / 100 * y
		];
	}
	function terug(x, y) {
		return [
			x,
			y
		];
	}
	function drawPath() {
		var p = [];
		for (var j = 1, jj = X.length; j < jj; j++) {
			p.push(X[j], Y[j]);
		}
		p = ["M", X[0], Y[0], "R"].concat(p);
		var subaddon = "L" + (W - 10) + "," + (H - 10) + ",50," + (H - 10) + "z";
		path.attr({path: p});
		sub.attr({path: p + subaddon});
	}
	function exit_svg() {
		callback(database);
		var hold = document.getElementById(holder);
		while (hold.firstChild) {
			hold.removeChild(hold.firstChild);
		}
	}

	var p = [["M"].concat(translate(0, values[0]))],
		color = "hsb(1°, 1, 1)",
		X = [],
		Y = [],
		blankets = r.set(),
		buttons = r.set(),
		grid_y = 8,
		w = (W - 60) / values.length,
		isDrag = -1,
		start = null,
		sub = r.path().attr({stroke: "none", 'fill-opacity': .4, fill: [90, 90, color].join("-"), opacity: .4}).dblclick(exit_svg),
		path = r.path().attr({stroke: color, "stroke-width": 2}),
		unhighlight = function () {};

	for (var y = 0; y< H; y+= grid_y)
		r.path("m 0 " + y + " l " + W + " 0").attr({stroke: "black", "stroke-width": (y/grid_y)%12==3?2:1, 'stroke-opacity': 0.5});

	/* this is not working yet */
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute('x','100');
	text.setAttribute('y','100');
	text.setAttribute('style', 'stroke:#ffffff');
	var textpath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
	document.getElementsByTagName("path")[1].id="kut";
	textpath.setAttribute("xlink:href", "#" + path.id);
	text.appendChild(textpath);
	textpath.textContent = "foo bar baz";
	// var data = document.getElementsByTagName("svg")[0].createTextNode("Hallo is robis hier");
	// textpath.appendChild(data);
	document.getElementsByTagName("path")[1].parentNode.appendChild(text);
	/* as you can see */

	var ii;
	for (i = 0, ii = values.length - 1; i < ii; i++) {
		var xy = translate(i, values[i]),
			xy1 = translate(i + 1, values[i + 1]),
			f;
		X[i] = xy[0];
		Y[i] = xy[1];
		(f = function (i, xy) {
			var but = r.circle(xy[0], xy[1], 5).attr({fill: 'black', stroke: "none"});
			buttons.push(but);
			blankets.push(r.circle(xy[0], xy[1], w / 2).attr({stroke: "none", fill: "#000", opacity: 0}).mouseover(function () {
				if (isDrag + 1) {
					unhighlight = function () {};
				} else {
					buttons.items[i].animate({r: 10}, 200);
				}
			}).mouseout(function () {
				if (isDrag + 1) {
					unhighlight = function () {
						buttons.items[i].animate({r: 5}, 200);
					};
				} else {
					buttons.items[i].animate({r: 5}, 200);
				}
			}).drag(function (dx, dy) {
				this.start && update(this.start.i, Raphael.snapTo(grid_y, this.start.p + dy, grid_y/2));
			}, function (x, y) {
				this.start = {i: i, m: y, p: Y[i]};
			}).dblclick(exit_svg)
			);
			blankets.items[blankets.items.length - 1].node.style.cursor = "move";
		})(i, xy);
		if (i == ii - 1) {
			f(i + 1, xy1);
		}
	}
	xy = translate(ii, values[ii]);
	X.push(xy[0]);
	Y.push(xy[1]);
	
	drawPath();
	var lst = 0;
	var update = function (i, d) {
		(d > H - 10) && (d = H - 10);
		(d < 10) && (d = 10);
		Y[i] = d;
		drawPath();
		buttons.items[i].attr({cy: d});
		blankets.items[i].attr({cy: d});
		r.safari();
		var ny = Math.floor(((d - 10 )/ ( H - 20 )) * 100);
		database[i] = 100 - ny;
	};
};

