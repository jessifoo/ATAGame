#pragma strict

var health : float = 100;

function FixedUpdate () {
	
}

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
