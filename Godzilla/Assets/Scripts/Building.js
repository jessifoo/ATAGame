#pragma strict

//Gizmo code:
function OnDrawGizmos() {
	Gizmos.color = Color (1, 1, 1, .2);
	var buildingScale : Vector3 = transform.localScale;
	buildingScale.y *= 2;
	buildingScale.x *= 0.5;
	buildingScale.z *= 0.5;
	Gizmos.DrawCube(transform.position, buildingScale);
}


//Health of the building:
var health : float = 100;

function FixedUpdate () {
	
}

//Building got damaged!
function Damage ( amount : float ) {
	health -= amount;
	if ( health <= 0 ) {
		DoDeath();
	} else {
		PlayDamageAnimation();
	}
}

//Perform the death:
function DoDeath() {
	//TODO: Add some fancy graphical effects here
	Destroy(this);
}

//Play damaged animation
function PlayDamageAnimation() : void {
	
}
