/**
 * @module Shape
 * @submodule Curves
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype._bezierDetail = 20;
  p5.prototype._curveDetail = 20;

  /**
   * Draws a Bezier curve on the screen. These curves are defined by a series
   * of anchor and control points. The first two parameters specify the first
   * anchor point and the last two parameters specify the other anchor point.
   * The middle parameters specify the control points which define the shape
   * of the curve. Bezier curves were developed by French engineer Pierre
   * Bezier.
   *
   * @method bezier
   * @param  {Number} x1 x-coordinate for the first anchor point
   * @param  {Number} y1 y-coordinate for the first anchor point
   * @param  {Number} x2 x-coordinate for the first control point
   * @param  {Number} y2 y-coordinate for the first control point
   * @param  {Number} x3 x-coordinate for the second control point
   * @param  {Number} y3 y-coordinate for the second control point
   * @param  {Number} x4 x-coordinate for the second anchor point
   * @param  {Number} y4 y-coordinate for the second anchor point
   * @return {Object}    the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * stroke(255, 102, 0);
   * line(85, 20, 10, 10);
   * line(90, 90, 15, 80);
   * stroke(0, 0, 0);
   * bezier(85, 20, 10, 10, 90, 90, 15, 80);
   * </code>
   * </div>
   */
  p5.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this._doStroke) {
      return;
    }
    var ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    //for each point as considered by detail, iterate
    for (var i = 0; i <= this._bezierDetail; i++) {
      var t = i / parseFloat(this._bezierDetail);
      var x = p5.prototype.bezierPoint(x1, x2, x3, x4, t);
      var y = p5.prototype.bezierPoint(y1, y2, y3, y4, t);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    return this;
  };

  /**
   * Sets the resolution at which Beziers display.
   *
   * The default value is 20.
   *
   * @method bezierDetail
   * @param {Number} detail resolution of the curves
   * @return {Object} the p5 object
   * @example
   * <div>
   * <code>
   * background(204);
   * bezierDetail(50);
   * bezier(85, 20, 10, 10, 90, 90, 15, 80);
   * </code>
   * </div>
   */
  p5.prototype.bezierDetail = function(d) {
    this._setProperty('_bezierDetail', d);
    return this;
  };

  /**
   * Calculate a point on the Bezier Curve
   *
   * Evaluates the Bezier at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points.
   * This can be done once with the x coordinates and a second time
   * with the y coordinates to get the location of a bezier curve at t.
   *
   * @method bezierPoint
   * @param {Number} a coordinate of first point on the curve
   * @param {Number} b coordinate of first control point
   * @param {Number} c coordinate of second control point
   * @param {Number} d coordinate of second point on the curve
   * @param {Number} t value between 0 and 1
   * @return {Number} the value of the Bezier at point t
   * @example
   * <div>
   * <code>
   * noFill();
   * bezier(85, 20, 10, 10, 90, 90, 15, 80);
   * fill(255);
   * steps = 10;
   * for (i = 0; i <= steps; i++) {
   *   t = i / steps;
   *   x = bezierPoint(85, 10, 90, 15, t);
   *   y = bezierPoint(20, 10, 90, 80, t);
   *   ellipse(x, y, 5, 5);
   * }
   * </code>
   * </div>
   */
  p5.prototype.bezierPoint = function(a, b, c, d, t) {
    var adjustedT = 1-t;

    return Math.pow(adjustedT,3)*a +
     3*(Math.pow(adjustedT,2))*t*b +
     3*adjustedT*Math.pow(t,2)*c +
     Math.pow(t,3)*d;
  };

  /**
   * Calculates the tangent of a point on a Bezier curve
   *
   * Evaluates the tangent at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points
   *
   * @method bezierTangent
   * @param {Number} a coordinate of first point on the curve
   * @param {Number} b coordinate of first control point
   * @param {Number} c coordinate of second control point
   * @param {Number} d coordinate of second point on the curve
   * @param {Number} t value between 0 and 1
   * @return {Number} the tangent at point t
   * @example
   * <div>
   * <code>
   * noFill();
   * bezier(85, 20, 10, 10, 90, 90, 15, 80);
   * steps = 6;
   * fill(255);
   * for (i = 0; i <= steps; i++) {
   *   t = i / steps;
   *   // Get the location of the point
   *   x = bezierPoint(85, 10, 90, 15, t);
   *   y = bezierPoint(20, 10, 90, 80, t);
   *   // Get the tangent points
   *   tx = bezierTangent(85, 10, 90, 15, t);
   *   ty = bezierTangent(20, 10, 90, 80, t);
   *   // Calculate an angle from the tangent points
   *   a = atan2(ty, tx);
   *   a += PI;
   *   stroke(255, 102, 0);
   *   line(x, y, cos(a)*30 + x, sin(a)*30 + y);
   *   // The following line of code makes a line 
   *   // inverse of the above line
   *   //line(x, y, cos(a)*-30 + x, sin(a)*-30 + y);
   *   stroke(0);
   *   ellipse(x, y, 5, 5);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noFill();
   * bezier(85, 20, 10, 10, 90, 90, 15, 80);
   * stroke(255, 102, 0);
   * steps = 16;
   * for (i = 0; i <= steps; i++) {
   *   t = i / steps;
   *   x = bezierPoint(85, 10, 90, 15, t);
   *   y = bezierPoint(20, 10, 90, 80, t);
   *   tx = bezierTangent(85, 10, 90, 15, t);
   *   ty = bezierTangent(20, 10, 90, 80, t);
   *   a = atan2(ty, tx);
   *   a -= HALF_PI;
   *   line(x, y, cos(a)*8 + x, sin(a)*8 + y);
   * }
   * </code>
   * </div>
   */
  p5.prototype.bezierTangent = function(a, b, c, d, t) {
    var adjustedT = 1-t;
    return 3*d*Math.pow(t,2) -
     3*c*Math.pow(t,2) +
     6*c*adjustedT*t -
     6*b*adjustedT*t +
     3*b*Math.pow(adjustedT,2) -
     3*a*Math.pow(adjustedT,2);
  };

  /**
   * Draws a curved line on the screen. The first and second parameters specify
   * the beginning control point and the last two parameters specify the ending
   * control point. The middle parameters specify the start and stop of the
   * curve. Longer curves can be created by putting a series of curve() 
   * functions together or using curveVertex(). An additional function called
   * curveTightness() provides control for the visual quality of the curve.
   * The curve() function is an implementation of Catmull-Rom splines. 
   * 
   * @method curve
   * @param  {Number} x1 x-coordinate for the beginning control point
   * @param  {Number} y1 y-coordinate for the beginning control point
   * @param  {Number} x2 x-coordinate for the first point
   * @param  {Number} y2 y-coordinate for the first point
   * @param  {Number} x3 x-coordinate for the second point
   * @param  {Number} y3 y-coordinate for the second point
   * @param  {Number} x4 x-coordinate for the ending control point
   * @param  {Number} y4 y-coordinate for the ending control point
   * @return {Object}    the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * stroke(255, 102, 0);
   * curve(5, 26, 5, 26, 73, 24, 73, 61);
   * stroke(0); 
   * curve(5, 26, 73, 24, 73, 61, 15, 65); 
   * stroke(255, 102, 0);
   * curve(73, 24, 73, 61, 15, 65, 15, 65);
   * </code>
   * </div>
   */
  p5.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this._doStroke) {
      return;
    }
    var ctx = this.canvas.getContext('2d');
    ctx.moveTo(x1,y1);
    ctx.beginPath();
    for (var i = 0; i <= this._curveDetail; i++) {
      var t = parseFloat(i/this._curveDetail);
      var x = p5.prototype.curvePoint(x1,x2,x3,x4,t);
      var y = p5.prototype.curvePoint(y1,y2,y3,y4,t);
      ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.closePath();

    return this;
  };

  /**
   * Sets the resolution at which curves display.
   *
   * The default value is 20.
   *
   * @method curveDetail
   * @param {Number} resolution of the curves
   * @return {Object} the p5 object
   * @example
   * <div>
   * <code>
   * background(204);
   * curveDetail(20);
   * curve(5, 26, 5, 26, 73, 24, 73, 61);
   * </code>
   * </div>
   */
  p5.prototype.curveDetail = function(d) {
    this._setProperty('_curveDetail', d);

    return this;
  };

  /**
   * Calculate a point on the Curve
   *
   * Evaluates the Bezier at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points.
   * This can be done once with the x coordinates and a second time
   * with the y coordinates to get the location of a curve at t.
   *
   * @method curvePoint
   * @param {Number} a coordinate of first point on the curve
   * @param {Number} b coordinate of first control point
   * @param {Number} c coordinate of second control point
   * @param {Number} d coordinate of second point on the curve
   * @param {Number} t value between 0 and 1
   * @return {Number} bezier value at point t
   * @example
   * <div>
   * <code>
   * noFill();
   * curve(5, 26, 5, 26, 73, 24, 73, 61);
   * curve(5, 26, 73, 24, 73, 61, 15, 65);
   * fill(255);
   * ellipseMode(CENTER);
   * steps = 6;
   * for (i = 0; i <= steps; i++) {
   *   t = i / steps;
   *   x = curvePoint(5, 5, 73, 73, t);
   *   y = curvePoint(26, 26, 24, 61, t);
   *   ellipse(x, y, 5, 5);
   *   x = curvePoint(5, 73, 73, 15, t);
   *   y = curvePoint(26, 24, 61, 65, t);
   *   ellipse(x, y, 5, 5);
   * }
   * </code>
   * </div>
   */
  p5.prototype.curvePoint = function(a, b,c, d, t) {
    var t3 = t*t*t,
      t2 = t*t,
      f1 = -0.5 * t3 + t2 - 0.5 * t,
      f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
      f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
      f4 = 0.5 * t3 - 0.5 * t2;
    return a*f1 + b*f2 + c*f3 + d*f4;
  };

  /**
   * Calculates the tangent of a point on a curve
   *
   * Evaluates the tangent at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points
   *
   * @method curveTangent
   * @param {Number} a coordinate of first point on the curve
   * @param {Number} b coordinate of first control point
   * @param {Number} c coordinate of second control point
   * @param {Number} d coordinate of second point on the curve
   * @param {Number} t value between 0 and 1
   * @return {Number} the tangent at point t
   * @example
   * <div>
   * <code>
   * noFill();
   * curve(5, 26, 73, 24, 73, 61, 15, 65); 
   * steps = 6;
   * for (i = 0; i <= steps; i++) {
   *   t = i / steps;
   *   x = curvePoint(5, 73, 73, 15, t);
   *   y = curvePoint(26, 24, 61, 65, t);
   *   //ellipse(x, y, 5, 5);
   *   tx = curveTangent(5, 73, 73, 15, t);
   *   ty = curveTangent(26, 24, 61, 65, t);
   *   a = atan2(ty, tx);
   *   a -= PI/2.0;
   *   line(x, y, cos(a)*8 + x, sin(a)*8 + y);
   * }
   * </code>
   * </div>
   */
  p5.prototype.curveTangent = function(a, b,c, d, t) {
    var t2 = t*t,
      f1 = (-3*t2)/2 + 2*t - 0.5,
      f2 = (9*t2)/2 - 5*t,
      f3 = (-9*t2)/2 + 4*t + 0.5,
      f4 = (3*t2)/2 - t;
    return a*f1 + b*f2 + c*f3 + d*f4;
  };

  /**
   */
  p5.prototype.curveTightness = function() {
    throw 'not yet implemented';
  };

  return p5;

});