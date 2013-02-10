#pragma strict

private var myTransform : Transform;
private var ray : Ray;
private var hit : RaycastHit;
private var controller : CharacterController;
private var buttonDownPhaseStart : float;
private var doubleClickPhaseStart : float;
var speed : float = 3.0F;
private var mousePos : Vector3;
private var target : Vector3;
private var click : String;
private var city : CityGrid;
private var path : Array = new Array();
public var fire : ParticleSystem;
private var fireCollider : BoxCollider;

function Start () {
	controller = GetComponent(CharacterController);
	myTransform = gameObject.transform;
	city = GameObject.Find("CityGrid").GetComponent(CityGrid);
	
	fire = GetComponentInChildren(ParticleSystem);
	if (fire)
		fire.enableEmission = false;
	fireCollider = GameObject.Find("FireBreath").GetComponent(BoxCollider).collider;
	fireCollider.enabled = false;
}

/*
function Update () {
	var position : Vector3;	
	if (Input.GetButtonDown ("Fire1")) {
			if(Input.mousePosition != null){
				position = Input.mousePosition;
				detectClickPC(position);
			}
	}else if(Input.GetTouch != null){
				//if(Input.GetTouch(0).position != null){
				//	position = new Vector3 (Input.GetTouch(0).position.x, myTransform.position.y, Input.GetTouch(0).position.y);
				//}
	}	
	startMovement(position);

}*/

/**
 * FIXED UPDATE!
 */
function FixedUpdate() {
	if ( isJumping ) {
		performJump();
		return; // ONLY do jumping
	} else {
		jumpCooldown(); //Cooldown the jump
	}
	
	if ( path.length > 0 ) {
		//Debug.Log("GODZILLA Follow PATH");
		followPath(path);
	}
	
}





//Look at a point
public function LookAtPoint(point:Vector3) : void {
	if ( path.length == 0 && !isJumping ) {
		point.y = transform.position.y;
		transform.LookAt(point);
	}
}

//Move Godzilla to the inputted point: (just set the path)
public function MoveToPoint( newPoint : Vector3 ) {
	path = city.getWorldPath_forGodzilla(myTransform.position, newPoint);
}



//Jump Godzilla to the inputted point:
public var canJump : boolean = true;
private var isJumping : boolean = false;
// Will not be shown in the inspector or serialized
@System.NonSerialized
var lastJumpTime : float = 0;
// Will not be shown in the inspector or serialized
@System.NonSerialized
var jump_cooldownTime : float = 5.0; //NOTE: This is from the LANDING TIME!!!!!!
private var jumpPoint : Vector3;
public function JumpToPoint( newPoint : Vector3 ) {
	canJump = false; // No longer can jump until cooldown completed!
	jumpPoint = city.gridPointToWorldPoint( city.getClosestAvailableGridPointTo(newPoint) );
	jumpPoint.y = transform.position.y;
	path = new Array(); // Clear the path for now
	LookAtPoint(jumpPoint);
	isJumping = true; //Begin jump!
	calculateJumpPoints();
}
//Calculate out a jump:
private var jumpTakeOffPoint : Vector3;
private var jumpVerticalPoint1 : Vector3;
private var jumpVerticalPoint2 : Vector3;
private var jumpLandPoint : Vector3;
private var jumpHeight : float = 10.0;
private var jump_PhaseFrames : float = 20;//Frames until jumpPhase is over
private var jump_PhaseFrame : float = 0;//Current frame of jumpPhase
function calculateJumpPoints() {
	jumpTakeOffPoint = transform.position;
	jumpVerticalPoint1 = jumpTakeOffPoint + Vector3.up * jumpHeight;
	jumpLandPoint = jumpPoint;
	jumpVerticalPoint2 = jumpLandPoint + Vector3.up * jumpHeight;
	jump_state = 0;
	jumpHeight = Camera.main.gameObject.transform.position.y;
}
//Perform a jump:
private var jump_state : int = 0;
private var cameraStartPosition : Vector3;
function performJump() {
	var newPosition : Vector3;
	//Where am I on the jump:
	if ( jump_state == 0 ) { //Takeoff:
		jump_PhaseFrame++;
		newPosition = Vector3.Slerp( jumpTakeOffPoint, jumpVerticalPoint1, jump_PhaseFrame / jump_PhaseFrames);
		transform.position = newPosition;
		if ( jump_PhaseFrame >= jump_PhaseFrames ) {
			jump_PhaseFrame = 0.0;
			jump_state++;
		}
	}
	if ( jump_state == 1 ) { //Go from P1 to P2:
		jump_PhaseFrame++;
		newPosition = Vector3.Slerp( jumpVerticalPoint1, jumpVerticalPoint2, jump_PhaseFrame / jump_PhaseFrames);
		transform.position = newPosition;
		if ( jump_PhaseFrame >= jump_PhaseFrames ) {
			jump_PhaseFrame = 0.0;
			jump_state++;
		}
	}
	if ( jump_state == 2 ) { //Go from P2 to Ground:
		jump_PhaseFrame++;
		newPosition = Vector3.Slerp( jumpVerticalPoint2, jumpLandPoint, jump_PhaseFrame / jump_PhaseFrames);
		transform.position = newPosition;
		if ( jump_PhaseFrame == jump_PhaseFrames ) {
			jump_PhaseFrame = 0.0;
			jump_state++;
		}
	}
	if ( jump_state == 3 ) { //We're here!
		transform.position = jumpLandPoint;
		cameraStartPosition = Camera.main.gameObject.transform.position;
		jump_state++;
	}
	if ( jump_state == 4 ) { //RUMBLE CAMERA!
		jump_PhaseFrame++;
		var shakeAmt : float = Random.Range(0, jump_PhaseFrame - jump_PhaseFrames) / jump_PhaseFrames;
		Camera.main.gameObject.transform.position = cameraStartPosition + Vector3.up * shakeAmt;
		if ( jump_PhaseFrame == jump_PhaseFrames / 2) {
			Camera.main.gameObject.transform.position = cameraStartPosition;
			jump_PhaseFrame = 0.0;
			jump_state++;
		}
	}
	if ( jump_state == 5 ) {
		isJumping = false;
		endJump();
	}
}


function endJump() {
	isJumping = false;
	lastJumpTime = Time.time;
	path = new Array();
}

//Cooldown the jump:
function jumpCooldown() {
	if ( Time.time > lastJumpTime + jump_cooldownTime) {
		canJump = true;
	}
}











//FLAME ON!
var flaming : boolean = false;
public function FlameOn() {
	flaming = true;
	fire.enableEmission = true;
	fireCollider.enabled = true;
	Debug.Log("FLAAAAAAAAAAAAME!!!");
}
public function FlameOff() {
	fire.enableEmission = false;
	flaming = false;
	fireCollider.enabled = false;
}









/**
 * MOVEMENT CODE BELOW:
 */
	function startMovement(toPosition : Vector3){
		var ray : Ray = Camera.main.ScreenPointToRay (toPosition);
		if (Physics.Raycast (ray, hit, 100)) {
			target = hit.point;
			target.y = myTransform.position.y;			
			path = city.getWorldPath(myTransform.position, target);
			followPath(path);
		}else if(path){
			followPath(path);
		}
	}
	/*
	function detectClickPC(position : Vector3){
	if (Input.GetMouseButtonDown (0)) {
			buttonDownPhaseStart = Time.time; 
		}
 
		if (doubleClickPhaseStart > -1 && (Time.time - doubleClickPhaseStart) > 0.2f) {
			Debug.Log ("single click");
			click = "single";
			doubleClickPhaseStart = -1;
		}
 
		if (Input.GetMouseButtonUp (0)) {
			if (Time.time - buttonDownPhaseStart > 1.0f) {
				Debug.Log ("long click");
				doubleClickPhaseStart = -1;
			} else {
				if (Time.time - doubleClickPhaseStart < 0.2f) {
					Debug.Log ("double click");
					click = "double";
					doubleClickPhaseStart = -1;
					leap(position);
				} else {
					doubleClickPhaseStart = Time.time;
				}    
			}
		}	
	}*/
	
	//Follow a path:
	function followPath(path : Array){
		if (path.length > 0) {
			//var prevPoint : Vector3 = path[0];
			//var currentPoint : Vector3;
			//for ( var ii : int = 1; ii < path.length; ii++ ) {
				//currentPoint = path[ii];
				//Debug.DrawLine(prevPoint,currentPoint, Color.red);
				//prevPoint = path[ii];
			//}
			
			
			var point : Vector3 = path[0];
			point.y = myTransform.position.y;
			var distance : float = Vector3.Distance (myTransform.position, point);
			//Debug.Log("Follow Path Distance " + distance);
			//Debug.DrawLine(transform.position, point, Color.white,1);
			if(distance <= 0.1){
				//Debug.Log("At point");
				path.RemoveAt(0);
			}else{
				//Debug.Log("Move to point");
				moveTo(point);
			}
		}
	}
	//Move to a given point:
	function moveTo (point : Vector3)
	{
		var distance : float = Vector3.Distance (myTransform.position, point);
		//Debug.Log("Distance "+distance);
		if (distance > 0) {
			myTransform.LookAt (point);
			myTransform.position += myTransform.forward * Time.deltaTime * speed;
		} else {
			myTransform.position = point;
		}
	}


	
	/*
	function leap(position : Vector3){
		Debug.Log("in leap");
		//var direction : Vector3 = (position - myTransform.position).normalized;
		//direction.y = myTransform.position.y;
		//myTransform.position += direction * Time.deltaTime * speed;
		//myTransform.position += myTransform.forward * Time.deltaTime * 2 * speed; 
		
//		var distance : float = Vector3.Distance (myTransform.position, position);
//		if (distance > 0.1) {
//			myTransform.position += myTransform.forward * Time.deltaTime * 2* speed;
//		}
		myTransform.position.x += 2;
	}
	
	function OnGUI(){
		GUI.Label (Rect (10, 10, 100, 20), " ");
	}*/		