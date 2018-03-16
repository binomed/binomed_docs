registerPaint('cadre', class {
	constructor(){
		this.TOP_LEFT = 100;
		this.TOP_RIGHT = 200;
		this.BOTTOM_LEFT = 300;
		this.BOTTOM_RIGHT = 400;
	}

	static get inputProperties() {
        return [
			'--cadre-color'
		];
    }
    paint(ctx, geom, properties) {
		console.log('cadre Paint !');
		const color = properties.get('--cadre-color');
		// Change the fill color.
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;

		const padding = 50;

		// Internal Border
		ctx.beginPath();
		ctx.moveTo(padding, padding);
		ctx.lineTo(geom.width - padding, padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(geom.width - padding, padding);
		ctx.lineTo(geom.width - padding, geom.height - padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(geom.width - padding, geom.height - padding);
		ctx.lineTo(padding, geom.height - padding);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(padding, geom.height - padding);
		ctx.lineTo(padding, padding);
		ctx.stroke();

		const params = {
			padding,
			paddingCurve : 30,
			lengthLine : 120,
			lengtShorthLine : 3,
			distCurve : 17,
			paddingTop : 10,
			deltaArrivedSecondCurveX : 30,
			deltaFirstPointeX: 32,
			deltaSecondPointeX: 25,
			deltaSecondPointeY: 15,
			deltaCourbe2 : 7,
			deltaWidthArcTallStart: 30,
			deltaHeightArcGrandArrived: 5,
			deltaArcTallCurve: 12,
			deltaWidthArcSmallStart: 35,
			deltaWidthArcSmallArrived: 20,
			deltaArcSmallCurve: 8,

		}

		this.drawCorner(ctx, params, geom, this.TOP_LEFT);
		// this.drawCorner(ctx, params, this.TOP_RIGHT);
		// this.drawCorner(ctx, params, this.BOTTOM_LEFT);
		// this.drawCorner(ctx, params, this.BOTTOM_RIGHT);

		// Objectif : https://www.peanutgalleryfilms.com/
		// Helper Bezier : http://blogs.sitepointstatic.com/examples/tech/canvas-curves/bezier-curve.html

	}

	drawCorner(ctx, params, geom, corner){
		const {
			padding,
			paddingCurve,
			lengthLine,
			lengtShorthLine,
			distCurve,
			paddingTop,
			deltaArrivedSecondCurveX,
			deltaFirstPointeX,
			deltaSecondPointeX,
			deltaSecondPointeY,
			deltaCourbe2,
			deltaWidthArcTallStart,
			deltaHeightArcGrandArrived,
			deltaArcTallCurve,
			deltaWidthArcSmallStart,
			deltaWidthArcSmallArrived,
			deltaArcSmallCurve,
		} = params;
		// Corner Left
		const points = [
			{x: padding, y: paddingCurve}, // Point de départ
			{x: padding, y: paddingTop}, // Point Première boucle
			{x: padding - deltaArrivedSecondCurveX, y: (paddingCurve - paddingTop)}, // Point second Boucle
			{x: padding - deltaFirstPointeX, y: paddingTop}, // Point pointe
			{x: padding - deltaSecondPointeX, y: deltaSecondPointeY}, // Point pointe deuxième
			{x: paddingTop, y: padding}, // Point troisième Boucle
			{x: paddingCurve, y: padding}, // Point arrivée
		]
		ctx.beginPath();
		// Ligne droite horizontale (petit trait)
		ctx.moveTo(points[0].x + lengthLine + lengtShorthLine, points[0].y);
		ctx.lineTo(points[0].x + lengthLine + lengtShorthLine * 2 , points[0].y);
		// Ligne droite horizontale (petit point)
		ctx.moveTo(points[0].x + lengthLine + lengtShorthLine * 3, points[0].y);
		ctx.lineTo(points[0].x + lengthLine + lengtShorthLine * 3 + 1, points[0].y);
		// Ligne droite horizontale
		ctx.moveTo(points[0].x, points[0].y);
		ctx.lineTo(points[0].x + lengthLine, points[0].y);
		// Placement pour les courbes
		// Courbe 1 (horizontale)
		ctx.moveTo(points[0].x, points[0].y);
		ctx.bezierCurveTo(
			points[0].x - distCurve, // x du décalage  point de départ
			points[0].y, // y du déclage de départ
			points[1].x - distCurve, // x du décalage d'arrivée
			points[1].y, // y du décalage du point d'arrivé
			points[1].x, // x du point d'arrivée
			points[1].y) // y du point d'arrivée
		// Courbe 2 (horizontale)
		ctx.bezierCurveTo(
			points[1].x + distCurve - deltaCourbe2, // x du décalage  point de départ
			points[1].y + distCurve - deltaCourbe2, // y du déclage de départ
			points[2].x + distCurve - deltaCourbe2, // x du décalage d'arrivée
			points[2].y + distCurve - deltaCourbe2, // y du décalage du point d'arrivé
			points[2].x, // x du point d'arrivée
			points[2].y) // y du point d'arrivée
		// Pointe 1
		ctx.lineTo(points[3].x, points[3].y);
		// Fin "diamant"
		ctx.lineTo(points[4].x, points[4].y);
		// Courbe 2 (verticale)
		ctx.bezierCurveTo(
			points[4].x + distCurve - deltaCourbe2, // x du décalage  point de départ
			points[4].y + distCurve - deltaCourbe2, // y du déclage de départ
			points[5].x + distCurve - deltaCourbe2, // x du décalage d'arrivée
			points[5].y + distCurve - deltaCourbe2, // y du décalage du point d'arrivé
			points[5].x, // x du point d'arrivée
			points[5].y) // y du point d'arrivée
		// Courbe 1 (verticale)
		ctx.bezierCurveTo(
			points[5].x, // x du décalage  point de départ
			points[5].y - distCurve, // y du déclage de départ
			points[6].x, // x du décalage d'arrivée
			points[6].y - distCurve, // y du décalage du point d'arrivé
			points[6].x, // x du point d'arrivée
			points[6].y) // y du point d'arrivée
		// ligne droite verticale
		ctx.lineTo(points[6].x, points[6].y + lengthLine);
		// ligne droite verticale (petit trait)
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 2);
		// ligne droite verticale (petit point)
		ctx.moveTo(points[6].x, points[6].y + lengthLine + lengtShorthLine * 3);
		ctx.lineTo(points[6].x, points[6].y + lengthLine  + lengtShorthLine * 3 + 1);
		ctx.stroke();

		// vaguelettes
		const pointsVaguelettes = [
			// Ligne
			{x: points[0].x + deltaWidthArcTallStart, y: points[0].y},
			{x: points[0].x + paddingTop, y: points[1].y + deltaHeightArcGrandArrived},
			{x: points[0].x + deltaWidthArcSmallStart, y: points[0].y},
			{x: points[0].x + deltaWidthArcSmallArrived, y: points[1].y + paddingTop},
			// Colonne
			{x: points[6].x, y: points[6].y + deltaWidthArcTallStart},
			{x: points[5].x + deltaHeightArcGrandArrived, y: points[6].y + paddingTop},
			{x: points[6].x, y: points[6].y + deltaWidthArcSmallStart},
			{x: points[5].x + paddingTop, y: points[6].y + deltaWidthArcSmallArrived},
		]
		ctx.beginPath();
		// Arc horizontal Grand
		ctx.moveTo(pointsVaguelettes[0].x, pointsVaguelettes[0].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[0].x - deltaArcTallCurve, // x du décalage  point de départ
			pointsVaguelettes[0].y, // y du déclage de départ
			pointsVaguelettes[1].x, // x du décalage d'arrivée
			pointsVaguelettes[1].y + deltaArcTallCurve, // y du décalage du point d'arrivé
			pointsVaguelettes[1].x, // x du point d'arrivée
			pointsVaguelettes[1].y) // y du point d'arrivée
		// Arc horizontal Petit
		ctx.moveTo(pointsVaguelettes[2].x, pointsVaguelettes[2].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[2].x - deltaArcSmallCurve, // x du décalage  point de départ
			pointsVaguelettes[2].y, // y du déclage de départ
			pointsVaguelettes[3].x, // x du décalage d'arrivée
			pointsVaguelettes[3].y + deltaArcSmallCurve, // y du décalage du point d'arrivé
			pointsVaguelettes[3].x, // x du point d'arrivée
			pointsVaguelettes[3].y) // y du point d'arrivée
		// Arc vertical grand
		ctx.moveTo(pointsVaguelettes[4].x, pointsVaguelettes[4].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[4].x, // x du décalage  point de départ
			pointsVaguelettes[4].y - deltaArcTallCurve , // y du déclage de départ
			pointsVaguelettes[5].x + deltaArcTallCurve, // x du décalage d'arrivée
			pointsVaguelettes[5].y, // y du décalage du point d'arrivé
			pointsVaguelettes[5].x, // x du point d'arrivée
			pointsVaguelettes[5].y) // y du point d'arrivée
		// Arc vertical petit
		ctx.moveTo(pointsVaguelettes[6].x, pointsVaguelettes[6].y);
		ctx.bezierCurveTo(
			pointsVaguelettes[6].x, // x du décalage  point de départ
			pointsVaguelettes[6].y -deltaArcSmallCurve , // y du déclage de départ
			pointsVaguelettes[7].x + deltaArcSmallCurve, // x du décalage d'arrivée
			pointsVaguelettes[7].y, // y du décalage du point d'arrivé
			pointsVaguelettes[7].x, // x du point d'arrivée
			pointsVaguelettes[7].y) // y du point d'arrivée
		ctx.stroke();

	}
});

registerPaint('cadre-img', class {
	static get inputProperties() {
        return [
			'--cadre-corner-1',
			'--cadre-corner-2',
			'--cadre-corner-3',
			'--cadre-corner-4'
		];
    }
    paint(ctx, geom, properties) {
		console.log('cadre Paint !');
		const corner1 = properties.get('--cadre-corner-1');
		const corner2 = properties.get('--cadre-corner-2');
		const corner3 = properties.get('--cadre-corner-3');
		const corner4 = properties.get('--cadre-corner-4');
		// Change the fill color.
		console.log(corner1.state);
		console.log(corner1);
        ctx.drawImage(corner1, 0, 0, 150, 150);
        ctx.drawImage(corner2, geom.width - 150, 0, 150, 150);
        ctx.drawImage(corner3, geom.width - 150,  geom.height - 150, 150, 150);
        ctx.drawImage(corner4, 0,  geom.height - 150, 150, 150);
        ctx.drawImage(corner1, 200, 200, geom.width, geom.height);
    }
});