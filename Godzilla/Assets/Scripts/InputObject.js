#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.DrawIcon(transform.position, "Input.png");
}

/**
 * INPUT OBJECT
 * 
 * ALL INPUT SHOULD GO THROUGH HERE
 */

var godzilla : Godzilla;
var cityGrid : CityGrid;

function Start () {
	godzilla = GameObject.Find("Godzilla").GetComponent(Godzilla);
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
}


//Update:
function FixedUpdate () {
	ControlGodzilla();
	MoveCamera();
}

//Perform Fire1 Actions:
var lastClickTime : float = 0;
private var doubleClickTimeOut : float = 0.2;
function ControlGodzilla() : void {
	var screenPosition : Vector2;
	var worldPosition : Vector3;
	if (Input.GetButtonDown ("Fire1") && Input.mousePosition != null) {
		//Get the mouse position:
		screenPosition = Input.mousePosition;
		//And the world position:
		var hit : RaycastHit;
		var ray : Ray = Camera.main.ScreenPointToRay (screenPosition);
		if (Physics.Raycast (ray, hit, 100)) {
			worldPosition = hit.point;
			hit.point.y = 0;
			
			//Is this a double-click?
			Debug.Log("lastClickTime + doubleClickTimeOut >= Time.time="+lastClickTime +"+"+ doubleClickTimeOut +">="+ Time.time +" = "+(lastClickTime + doubleClickTimeOut >= Time.time));
			if ( lastClickTime + doubleClickTimeOut >= Time.time ) {
				//Do Double Click:
				godzilla.JumpToPoint(worldPosition);
			} else {
				//Do Single Click:
				godzilla.MoveToPoint(worldPosition);
			}
		}
	}
	if ( Input.GetButtonUp("Fire1") ) {
		lastClickTime = Time.time;
	}
	
	if ( Input.GetKey("space") ) {
		godzilla.FlameOn();
	} else {
		godzilla.FlameOff();
	}
}

//Move the Camera:
function MoveCamera() : void {
	//Zoom In:
	var scrollWheelDelta : float = Input.GetAxis("Mouse ScrollWheel");
	var scrollWheelSpeed : float = 2.0;
	Camera.main.gameObject.transform.position.y += scrollWheelDelta * scrollWheelSpeed;
	
	//Move:
	var cameraMoveSpeed : float = Camera.main.gameObject.transform.position.y / 20;
	var horizontalDelta : float = Input.GetAxis("Horizontal");
	Camera.main.gameObject.transform.position.x += horizontalDelta * cameraMoveSpeed;
	var verticalDelta : float = Input.GetAxis("Vertical");
	Camera.main.gameObject.transform.position.z += verticalDelta * cameraMoveSpeed;
	//Keep Camera Inside World:
	if (Camera.main.gameObject.transform.position.x > cityGrid.world_maxX ) {
		Camera.main.gameObject.transform.position.x = cityGrid.world_maxX;
	}
	if (Camera.main.gameObject.transform.position.x < cityGrid.world_minX ) {
		Camera.main.gameObject.transform.position.x = cityGrid.world_minX;
	}
	if (Camera.main.gameObject.transform.position.z > cityGrid.world_maxZ ) {
		Camera.main.gameObject.transform.position.z = cityGrid.world_maxZ;
	}
	if (Camera.main.gameObject.transform.position.z < cityGrid.world_minZ ) {
		Camera.main.gameObject.transform.position.z = cityGrid.world_minZ;
	}
}












