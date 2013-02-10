#pragma strict


var walkSpeed : float = 1f;
var runSpeed : float = 3f;
var viewRadius : float = 5f;
var speedDeviation : float = 0.5f;
var maxRandTurn : float = 5.0f;

var myTransform : Transform;
var cityGrid : CityGrid;
var godzilla : Transform;

private var flames : ParticleSystem;

// testing values
var testPoint = Vector3(20, 0.5, 20);
var points = new Array(testPoint, Vector3(30, 0.5, 40));

function Start () {
	myTransform = gameObject.transform;
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
	var zilla: GameObject = GameObject.Find("Godzilla");
	godzilla = zilla.transform;
	
	flames = GetComponentInChildren(ParticleSystem);
	if (flames)
		flames.enableEmission = false;

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

function OnTriggerEnter(other : Collider) {
	print("trigger enter");
	if (other.name == "Godzilla") {
		Kill();
		print("kill civilian");
	} else if (other.name == "FireBreath") {
		OnFire();
	}
}

function Move( speed : float ) {
	var hit : RaycastHit;
	var p1 : Vector3 = myTransform.position;
	var p2 : Vector3 = p1 + myTransform.forward * speed * Time.deltaTime * 2;
	var distance : float = Vector3.Distance(p1, p2);
	
    if ( Physics.SphereCast(p1, myTransform.localScale.z, myTransform.forward, hit, distance)) {
    	var direction : Vector3 = transform.forward;
		direction = Vector3.Reflect(direction, hit.normal);
		
		direction.y = 0;
		direction.Normalize();
		
		RotateToDirection(direction);
    }
	GetComponent(CharacterController).Move(myTransform.forward * speed * Time.deltaTime);
}
//Rotate to a direction:
function RotateToDirection(direction : Vector3) {
	var dir_vec2 : Vector2 = new Vector2(direction.x, direction.z);
	var forward_vec2 : Vector2 = new Vector2(transform.forward.x, transform.forward.z);
	var angle : float = Vector2.Angle(forward_vec2, dir_vec2);
	
	var cross : float = Vector3.Cross(direction, transform.forward).y;
	var sign : int = cross < 0 ? 1 : -1;
	
	myTransform.Rotate(0, sign * angle, 0);
}

function RandomWalk() {
	var randTurn = Random.Range(-maxRandTurn, maxRandTurn);
	myTransform.Rotate(0, randTurn, 0);
	Move(walkSpeed);
}

function RunToPoint(newPos : Vector3) {
	//myTransform.LookAt(newPos);
	RotateToDirection( newPos );
	Move(runSpeed);
}

function RunFromEnemy() {
	var dirToRun : Vector3 = myTransform.position - godzilla.position;
	dirToRun.y = 0;
	RunToPoint(dirToRun);
}

function OnFire() {
	flames.enableEmission = true;
	yield WaitForSeconds(3.0);
	Kill();
}

function Kill() {
	// TODO a score update as well...
	Destroy(gameObject);
}