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
private var path : Array;

function Start () {
	controller = GetComponent(CharacterController);
	myTransform = gameObject.transform;
	city = GameObject.Find("CityGrid").GetComponent(CityGrid);
}

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

	}
	
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
	}
	
	
	function followPath(path : Array){
		if (path.length > 0){
			var distance : float = Vector3.Distance (myTransform.position, path[0]);
			if(distance < 1.1){
				Debug.Log("At point");
				path.RemoveAt(0);
			}else{
				Debug.Log("Move to point");
				moveTo(path[0]);
			}
		}
	}
	
	function moveTo (point : Vector3)
	{
		point.y = myTransform.position.y;
		var distance : float = Vector3.Distance (myTransform.position, point);
		myTransform.LookAt (point);
		if (distance > 0.1) {
			myTransform.position += myTransform.forward * Time.deltaTime * speed;
		}
	}


	
	
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
	}		