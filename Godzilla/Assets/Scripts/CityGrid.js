#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.DrawIcon(transform.position, "Grid.png");
}

//Grid size is 1x1

/*
	//Grid loop:
	var ii : int;
	var jj : int;
	for ( ii = 0; ii < gridSizeX; ii++ ) {
		for ( jj = 0; jj < gridSizeZ; jj++ ) {
			
		}
	}
*/

//Grid variables:
var gridSizeX : int;
var gridSizeZ : int;
var world_maxX : float = 0;
var world_maxZ : float = 0;
var world_minX : float = 0;
var world_minZ : float = 0;

var canMoveGrid : boolean[,];

//During Start, setup the camera variables
function Start () {
	//Determine the grid size for this map:
	var gridMaxPoints : Array = GameObject.FindGameObjectsWithTag("GridMaxPoint");
	for ( var gridMaxPoint : GameObject in gridMaxPoints ) {
		if ( gridMaxPoint.transform.position.x > world_maxX ) {
			world_maxX = gridMaxPoint.transform.position.x;
		}
		if ( gridMaxPoint.transform.position.z > world_maxZ ) {
			world_maxZ = gridMaxPoint.transform.position.z;
		}
		if ( gridMaxPoint.transform.position.x < world_minX ) {
			world_minX = gridMaxPoint.transform.position.x;
		}
		if ( gridMaxPoint.transform.position.z < world_minZ ) {
			world_minZ = gridMaxPoint.transform.position.z;
		}
	}
	gridSizeX = world_maxX - world_minX;
	gridSizeZ = world_maxZ - world_minZ;
	
	//Debug.Log("CityGrid World Coordinates: maxX "+world_maxX+"maxZ "+world_maxZ+" / minX "+world_minX+"minZ "+world_minZ);
	//Debug.Log("SizeX:"+gridSizeX+" SizeZ:"+gridSizeZ);
	
	//Create the filled grid:
	canMoveGrid = new boolean[gridSizeX, gridSizeZ]; //Auto-initializes to false
	//Grid loop:
	var ii : int;
	var jj : int;
	for ( ii = 0; ii < gridSizeX; ii++ ) {
		for ( jj = 0; jj < gridSizeZ; jj++ ) {
			canMoveGrid[ii, jj] = true;
		}
	}
	
	var buildings : Array = GameObject.FindGameObjectsWithTag("Building");
	for ( var building : GameObject in buildings) {
		addBuilding(building);
	}
	
	
	/*
	//Check out how our grid looks:
	debug_outputGrid();
	//Check out grid to world:
	var worldPoint : Vector3 = worldPointToGridPoint( new Vector3( 0,0,0 ) );
	Debug.Log("World point: " + worldPoint.x + "," + worldPoint.z);
	worldPoint = worldPointToGridPoint( new Vector3( 1,0,2 ) );
	Debug.Log("World point: " + worldPoint.x + "," + worldPoint.z);
	worldPoint = worldPointToGridPoint( new Vector3( 1,0,-2 ) );
	Debug.Log("World point: " + worldPoint.x + "," + worldPoint.z);
	worldPoint = worldPointToGridPoint( new Vector3( 1,0,-2 ) );
	Debug.Log("World point: " + worldPoint.x + "," + worldPoint.z);
	//*/
}

//Add a building to the grid:
function addBuilding (building : GameObject) : void {
	//For now, buildings are size 1,1:
	var gridPoint : Vector2 = worldPointToGridPoint( building.transform.position );
	canMoveGrid[gridPoint.x, gridPoint.y] = false;
}

//Utility function to trace out the Grid:
function debug_outputGrid () : void {
	var gridString : String = "";
	var ii : int;
	var jj : int;
	for ( jj = gridSizeZ-1; jj >= 0; jj-- ) {
		for ( ii = 0; ii < gridSizeX; ii++ ) {
			if ( canMoveGrid[ii,jj] ) {
				gridString += "+";
			} else {
				gridString += "#";
			}
		}
		gridString += "\n";
	}
	Debug.Log(gridString);
}
//Get all available grid points:
function getAvailableGridPoints() : Array {
	var availableGridPoints : Array = new Array();
	var ii : int;
	var jj : int;
	for ( jj = gridSizeZ-1; jj >= 0; jj-- ) {
		for ( ii = 0; ii < gridSizeX; ii++ ) {
			if ( canMoveGrid[ii, jj] ) {
				availableGridPoints.Push(new Vector2(ii,jj));
			}
		}
	}
	return availableGridPoints;
}
//Get all available world points:
function getAvailableWorldPoints() : Array {
	var availableGridPoints : Array = getAvailableGridPoints();
	for ( var ii : int = 0; ii < availableGridPoints.length; ii++ ) {
		availableGridPoints[ii] = gridPointToWorldPoint(availableGridPoints[ii]);
	}
	return availableGridPoints;
}



/**
 * Translate a World Point into a Grid Point
 * @param	worldPoint
 * @return
 */
//World Point to Grid Point:
public function worldPointToGridPoint ( worldPoint : Vector3 ) : Vector2 {
	//Assume all world point coordinates' y values are zero:
	var gridPoint : Vector2 = new Vector2( 
						Mathf.Floor(worldPoint.x) - world_minX,
						Mathf.Floor(worldPoint.z) - world_minZ
						);
	//Debug.Log("Mathf.Floor(worldPoint.x) - world_minX:"+Mathf.Floor(worldPoint.x)+"-"+ world_minX);
	//Debug.Log("worldPointToGridPoint: "+ "World Point: "+worldPoint+" GridPoint:"+gridPoint);
	return gridPoint;
}
/**
 * Translate a Grid Point into a World Point
 * @param	gridPoint
 * @return
 */
//World Point to Grid Point:
public function gridPointToWorldPoint ( gridPoint : Vector2 ) : Vector3 {
	//Assume all world point coordinates' y values are zero:
	return new Vector3( 
						gridPoint.x + world_minX + 0.5,
						0,
						gridPoint.y + world_minZ + 0.5
						);
}


/**
 * Is GridPoint available?
 * @return
 */
function isGridPointAvailable(gridPoint : Vector2) : boolean {
	if ( isGridPointInGrid(gridPoint) ) {
		return canMoveGrid[gridPoint.x, gridPoint.y];
	}
	return false;
}
/**
 * Is GridPoint inside the grid?
 * @param	gridPoint
 */
function isGridPointInGrid(gridPoint : Vector2) : boolean {
	if (	gridPoint.x < 0 ||
			gridPoint.y < 0 ||
			gridPoint.x >= gridSizeZ ||
			gridPoint.y >= gridSizeZ 
		) {
			return false;
		}
	return true;
}

















/**
 * Gets the World Path from one point to another point FOR GODZILLA!
 * @param	from
 * @param	to
 * @return
 */
public function getWorldPath_forGodzilla(from:Vector3, to:Vector3):Array {
	var worldPointTo : Vector3 = to;
	//Use the closest Grid Point to the inputted point:
	var gridPointTo : Vector2 = worldPointToGridPoint(worldPointTo);
	if ( !isGridPointAvailable(gridPointTo) ) {
		gridPointTo = getClosestAvailableGridPointTo(worldPointTo);
		//Get the closest real-world point to the to point:
		var directionToToPoint : Vector3 = gridPointToWorldPoint(gridPointTo) - to;
		directionToToPoint.Normalize();
		
	}
	var gridPath : Array = getGridPath( worldPointToGridPoint(from), gridPointTo );
	//var gridPath : Array = getGridPath( worldPointToGridPoint(from), worldPointToGridPoint(worldPointTo) );
	//Copy into a world coordinate based path:
	var worldPath : Array = new Array(gridPath.length);
	for ( var ii : int = 0; ii < gridPath.length; ii++ ) {
		worldPath[ii] = gridPointToWorldPoint(gridPath[ii]);
	}
	//Add the destination point
	return worldPath;
}

/**
 * Gets the World Path from one point to another point
 * @param	from
 * @param	to
 * @return
 */
public function getWorldPath(from:Vector3, to:Vector3):Array {
	var worldPointTo : Vector3 = to;
	//Use the closest Grid Point to the inputted point:
	var gridPointTo : Vector2 = worldPointToGridPoint(worldPointTo);
	if ( !isGridPointAvailable(gridPointTo) ) {
		gridPointTo = getClosestAvailableGridPointTo(worldPointTo);
	}
	var gridPath : Array = getGridPath( worldPointToGridPoint(from), gridPointTo );
	//var gridPath : Array = getGridPath( worldPointToGridPoint(from), worldPointToGridPoint(worldPointTo) );
	//Copy into a world coordinate based path:
	var worldPath : Array = new Array(gridPath.length);
	for ( var ii : int = 0; ii < gridPath.length; ii++ ) {
		worldPath[ii] = gridPointToWorldPoint(gridPath[ii]);
	}
	//Add the destination point
	return worldPath;
}
//Find the closest available grid point to a particular world point:
function getClosestAvailableGridPointTo(worldPoint : Vector3) : Vector2 {
	var closestDistanceToWorldPoint : float = Mathf.Infinity;
	var distanceToWorldPoint : float;
	var otherWorldPoint : Vector3;
	var otherGridPoint : Vector2;
	var closestGridPoint : Vector2;
	var ii : int;
	var jj : int;
	for ( jj = gridSizeZ-1; jj >= 0; jj-- ) {
		for ( ii = 0; ii < gridSizeX; ii++ ) {
			if ( canMoveGrid[ii, jj] ) {
				otherGridPoint = new Vector2(ii, jj);
				otherWorldPoint = gridPointToWorldPoint(otherGridPoint);
				distanceToWorldPoint = (worldPoint - otherWorldPoint).magnitude;
				if ( distanceToWorldPoint < closestDistanceToWorldPoint ) {
					closestDistanceToWorldPoint = distanceToWorldPoint;
					closestGridPoint = otherGridPoint;
				}
			}
		}
	}
	return closestGridPoint;
}

/**
 * Gets the Grid Path from one gridPoint to another gridPoint
 * @param	from
 * @param	to
 * @return
 */
public function getGridPath(from:Vector2, to:Vector2):Array {
	//Grid variables: (we'll be using these a lot)
	var ii : int;
	var jj : int;
	
	//A* movement:
	var closedSet : Array = new Array();//The set of nodes already evaluated
	var openSet : Array = new Array();	//The set of tentative nodes to be evaluated,
	openSet.push(from);					//initially containing the first node
	var cameFrom : Vector2[, ] = new Vector2[gridSizeX, gridSizeZ]; //The map of navigated nodes.
	
	var g_score : float[, ] = new float[gridSizeX, gridSizeZ]; //Cost from start along best known path
	var f_score : float[, ] = new float[gridSizeX, gridSizeZ]; //Estimated total cost from gridX to goal
	
	//Initialize grids:
	for ( ii = 0; ii < gridSizeX; ii++ ) {
		for ( jj = 0; jj < gridSizeZ; jj++ ) {
			cameFrom[ii, jj] = nullVector2();
			g_score[ii, jj] = 0;
			f_score[ii, jj] = 0;
		}
	}
	
	f_score[from.x, from.y] = heuristic_cost_estimate(from, to); //Heuristic cost estimate
	
	//Main loop:
	var currentPoint : Vector2;
	while ( openSet.length > 0 )
	{
		currentPoint = get_node_w_lowest_f_score_in_openSet(openSet, f_score);
		if (currentPoint == to) {
			return reconstruct_gridPath(cameFrom, to);
		}
		
		openSet.RemoveAt( indexOfPointInArray(openSet,currentPoint) ); //Remove current from openset
		closedSet.push(currentPoint); //Add current to closed set
		var tentative_g_score : float;
		for each (var neighbor:Vector2 in getAdjacentGridPointsTo(currentPoint)) 
		{
			if ( isPointInArray( closedSet, neighbor) ) {
				continue;
			}
			tentative_g_score = g_score[currentPoint.x,currentPoint.y] + heuristic_cost_estimate(currentPoint, neighbor);
			
			//if neighbor not in openset or tentative_g_score <= g_score[neighbor] 
			if ( !isPointInArray(openSet, neighbor) || tentative_g_score <= g_score[neighbor.x,neighbor.y] ) {
				cameFrom[neighbor.x,neighbor.y] = currentPoint;
				g_score[neighbor.x,neighbor.y] = tentative_g_score;
				f_score[neighbor.x,neighbor.y] = g_score[neighbor.x,neighbor.y] + heuristic_cost_estimate(neighbor,to);
				if ( !isPointInArray(openSet,neighbor) ) {
					openSet.push(neighbor);
				}
			}
		}//End foreach neighbor
	}//End while loop
	return new Array(); //Could not find path
}

// ===== Utility functions used by getGridPath =====

//Heuristic cost estimate between two points:
function heuristic_cost_estimate( estimatePoint:Vector2, toPoint:Vector2 ):float {
	return (estimatePoint - toPoint).magnitude;
	//return getManhattenDistanceBetween(estimatePoint, toPoint);
}

//Substitute for a null Vector2 (since gridPoints will never be below 0)
function nullVector2() : Vector2 {
	return new Vector2( -1, -1);
}

//Reconstruct path
function reconstruct_gridPath(cameFrom:Vector2[,], goal:Vector2):Array
{
	var cameFromPoint : Vector2 = cameFrom[goal.x,goal.y];
	var pathArray : Array;
	if ( cameFromPoint != nullVector2() ) {
		pathArray = reconstruct_gridPath(cameFrom, cameFromPoint);
		pathArray.push( goal );
		return pathArray;
	} else {
		pathArray = new Array();
		pathArray.push( goal );
		return pathArray;
	}
	return new Array(); //Reconstruct path
}


//Get manhatten distance between two points
function getManhattenDistanceBetween(from:Vector2, to:Vector2):float
{
	return Mathf.Abs(from.x - to.x ) + Mathf.Abs(from.y - to.y );
}

//Utility function to get the node with the lowest f score
function get_node_w_lowest_f_score_in_openSet(openSet : Array, f_score : float[,]) : Vector2 {
	var current_f_score : float = Mathf.Infinity;
	var currentPoint : Vector2;
	for each ( var point:Vector2 in openSet ) {
		if ( f_score[point.x,point.y] < current_f_score ) {
			current_f_score = f_score[point.x,point.y];
			currentPoint = point;
		}
	}
	return currentPoint;
}

//Utility function to get a list of the adjacent points:
function getAdjacentGridPointsTo(centerPoint:Vector2) : Array {
	var adjacentPoints : Array = new Array();
	//Orthogonal directions
	var point_xm : Vector2 = new Vector2(centerPoint.x-1, centerPoint.y);
	var point_xp : Vector2 = new Vector2(centerPoint.x+1, centerPoint.y);
	var point_ym : Vector2 = new Vector2(centerPoint.x, centerPoint.y-1);
	var point_yp : Vector2 = new Vector2(centerPoint.x, centerPoint.y + 1);
	if ( isGridPointAvailable ( point_xm ) ) {
		adjacentPoints.push(point_xm);
	}
	if ( isGridPointAvailable ( point_xp ) ) {
		adjacentPoints.push(point_xp);
	}
	if ( isGridPointAvailable ( point_ym ) ) {
		adjacentPoints.push(point_ym);
	}
	if ( isGridPointAvailable ( point_yp ) ) {
		adjacentPoints.push(point_yp);
	}
	//Diagonal directions are only available if both points along the diagonal are also available
	var point_mm : Vector2 = new Vector2(centerPoint.x-1, centerPoint.y-1);
	var point_mp : Vector2 = new Vector2(centerPoint.x-1, centerPoint.y+1);
	var point_pm : Vector2 = new Vector2(centerPoint.x+1, centerPoint.y-1);
	var point_pp : Vector2 = new Vector2(centerPoint.x+1, centerPoint.y+1);
	if ( isGridPointAvailable ( point_mm ) && isGridPointAvailable ( point_xm ) && isGridPointAvailable ( point_ym ) ) {
		adjacentPoints.push(point_mm);
	}
	if ( isGridPointAvailable ( point_mp ) && isGridPointAvailable ( point_xm ) && isGridPointAvailable ( point_yp ) ) {
		adjacentPoints.push(point_mp);
	}
	if ( isGridPointAvailable ( point_pm ) && isGridPointAvailable ( point_xp ) && isGridPointAvailable ( point_ym ) ) {
		adjacentPoints.push(point_pm);
	}
	if ( isGridPointAvailable ( point_pp ) && isGridPointAvailable ( point_xp ) && isGridPointAvailable ( point_yp ) ) {
		adjacentPoints.push(point_pp);
	}
	return adjacentPoints;
}

//Utility function to get a point's index in an array
function indexOfPointInArray( arr : Array, searchPoint : Vector2 ) : int {
	var arrPoint : Vector2;
	for (var index:int = 0; index < arr.length; index++) {
		arrPoint = arr[index];
		if ( searchPoint == arrPoint ) {
			return index;
		}
	}
	return -1;
}

//Utility function to see if a point is in an array
function isPointInArray( arr : Array, comparisonPoint : Vector2 ) : boolean {
	for each (var point:Vector2 in arr) {
		if ( point == comparisonPoint) {
			return true;
		}
	}
	return false;
}


