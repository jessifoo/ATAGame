#pragma strict


var walkSpeed : float = 1f;
var runSpeed : float = 3f;
var viewRadius : float = 5f;
var speedDeviation : float = 0.5f;
var maxRandTurn : float = 5.0f;

var myTransform : Transform;
var cityGrid : CityGrid;
var godzilla : Transform;

// testing values
var testPoint = Vector3(20, 0.5, 20);
var points = new Array(testPoint, Vector3(30, 0.5, 40));

function Start () {
	myTransform = gameObject.transform;
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
	var zilla: GameObject = GameObject.Find("Godzilla");
	godzilla = zilla.transform;

	speedDeviation = Mathf.Clamp01(speedDeviation);
	var deviation = Random.Range(1-speedDeviation, speedDeviation+1);
	walkSpeed *= deviation;
	runSpeed *= deviation;
}

function Update () {
	
	var distToEnemy = Vector3.Distance(myTransform.position, godzilla.position);
	if (distToEnemy < viewRadius) {
		RunFromEnemy();
	} else {
		RandomWalk();
	}

}

function CheckCollisionAhead(speed : float) : Vector3{
	var hit : RaycastHit;
	var p1 : Vector3 = myTransform.position;
	var p2 : Vector3 = p1 + myTransform.forward * speed * Time.deltaTime;
	var distance : float = Vector3.Distance(p1, p2);
	
    if ( Physics.CapsuleCast (p1, p2, myTransform.localScale.z/2, myTransform.forward, hit, distance)) {
    	
    	//Old Code:
    	myTransform.Rotate(0, 180, 0);
    	
    	/*
    	var direction : Vector3 = p2 - p1;
    	var a1 : Vector3 = direction;
    	var a2 : Vector3 = hit.point - transform.position;
    	var cross : float = Vector3.Cross(a1, a2).y;
    	var sign : int = cross < 0 ? -1 : 1;
    	//I want the normal direction, rotated some degrees away from me
    	    	    	
    	direction = Quaternion.AngleAxis(sign*90, Vector3.up) * hit.normal;
    	direction.Normalize();
    	return direction;
    	direction.y = 0;
		transform.rotation.eulerAngles *= -1;   
		*/ 	
    }
    return transform.forward;
}

function RandomWalk() {
	var randTurn = Random.Range(-maxRandTurn, maxRandTurn);
	myTransform.Rotate(0, randTurn, 0);
	var direction = CheckCollisionAhead(walkSpeed);
	//myTransform.position += myTransform.forward * Time.deltaTime * walkSpeed;
	GetComponent(CharacterController).SimpleMove(direction * walkSpeed);
}

function RunToPoint(newPos : Vector3) {
	myTransform.LookAt(newPos);
	CheckCollisionAhead(runSpeed);
	//myTransform.position += myTransform.forward * Time.deltaTime * runSpeed;
	
	var direction = CheckCollisionAhead(runSpeed);
	//myTransform.position += myTransform.forward * Time.deltaTime * walkSpeed;
	GetComponent(CharacterController).SimpleMove(direction * runSpeed);
}

function RunFromEnemy() {
	var dirToRun : Vector3 = myTransform.position - godzilla.position;
	dirToRun.y = 0;
	RunToPoint(dirToRun);
}