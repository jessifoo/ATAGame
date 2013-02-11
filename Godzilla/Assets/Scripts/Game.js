#pragma strict

var killCount : int = 0;
var escapeCount : int = 0;
var escapedGameOverNum : int = 40;
private var gameover : boolean = false;
var gameoverPic : Texture;


//Gizmo code:
function OnDrawGizmos() {
	Gizmos.DrawIcon(transform.position, "Game.png");
}


var npcPrefab : GameObject;
var cityGrid : CityGrid;

function Start () {
	cityGrid = GameObject.Find("CityGrid").GetComponent(CityGrid);
	cityGrid.Start();
	if ( npcPrefab != null ) {
		spawnNPCs();
	}
}

//Spawn a bunch of random NPCs:
function spawnNPCs() {
	var availableWorldPoints : Array = cityGrid.getAvailableWorldPoints_Spawn();
	
	//Debug.Log("NPC Spawned!  World Points available:"+availableWorldPoints.length);
	var worldPoint : Vector3;
	for ( var ii : int = 0; ii < availableWorldPoints.length; ii++ ) {
		worldPoint = availableWorldPoints[ii];
		//worldPoint.y = 0.06;
		spawnNPCsInWorldPoint(worldPoint);
	}
}
function spawnNPCsInWorldPoint( worldPoint : Vector3 ) {
	var numNPCs : int = 3;
	for ( var ii : int = 0; ii < numNPCs; ii++ ) {
		spawnNPCInWorldPoint(worldPoint);
	}
}
function spawnNPCInWorldPoint( worldPoint : Vector3 ) {
	var npcY : float = 0.1;
	var npcOffset : Vector3 = new Vector3(Random.Range( -0.4, 0.4), npcY, Random.Range( -0.4, 0.4) );
	var npcFacing : Quaternion = Quaternion.AngleAxis(Random.Range(0,360), Vector3.up);
	var npc : GameObject = Instantiate( npcPrefab, worldPoint+npcOffset, npcFacing );
	//Debug.Log("NPC Spawned!");
}


function incrementKillBy(count : int){
	killCount += count;
}

function civilianEscaped(count : int){
	escapeCount += count;
	//if (escapeCount >= escapedGameOverNum)
		//GameOver();
}

function GameOver() {
	Debug.Log("Game is now Over!");
	gameover = true;
	yield WaitForSeconds(2);
	LevelLoadFade.FadeAndLoadLevel("Start 1", Color.white, 2.0);
}






//GUI:
var guiSkin : GUISkin;
var countdownSkin : GUISkin;
var final_killed : int;
var final_escaped : int;
function OnGUI () {
	if ( !gameover ) {
		GUI.skin = guiSkin;
		guiSkin.label.fontSize = 16;
		guiSkin.label.alignment = TextAnchor.UpperLeft;
		GUI.Label(Rect (10, 10, 100, 20), "Score: " + killCount );
		GUI.Label(Rect (10, 30, 100, 20), "Escaped: " + escapeCount );
		GUI.skin = countdownSkin;
		guiSkin.label.alignment = TextAnchor.UpperCenter;
		guiSkin.label.fontSize = 28;
		var clockWidth : float = 100;
		GUI.Label(Rect (Screen.width / 2 - clockWidth / 2, 10, clockWidth, 40), "" + countdown);
	}
	if (gameover) {
		GUI.skin = countdownSkin;
		guiSkin.label.alignment = TextAnchor.MiddleCenter;
		guiSkin.label.fontSize = 42;
		GUI.Label(Rect (0, 100, Screen.width, Screen.width), 
			"FINAL SCORE:\n\n" + "Citizens Killed: "+final_killed+"\n"+"Citizens Escaped: "+final_escaped);
		
		//GUI.Label(Rect ((Screen.height/2)-150,(Screen.width/2)-200,(Screen.height*1.3),(Screen.width)), gameoverPic);
	}
}

private var countdown_TOTAL : int = 60;
private var countdown : int = countdown_TOTAL;
function FixedUpdate () {
	//Update countdown:
	countdown = countdown_TOTAL - Mathf.FloorToInt(Time.time);
	if ( countdown < 0 && !gameover ) {
		gameover = true;
		final_killed = killCount;
		final_escaped = escapeCount;
	}
	if ( countdown < -5 ) {
		LevelLoadFade.FadeAndLoadLevel("Start 1", Color.green, 2.0);
	}
	//Do panic:
	doPanic();
	
	if (countdown == 10) {
		var npcs : GameObject[] = GameObject.FindGameObjectsWithTag("NPC");
		for(var i = 0; i < npcs.length ; ++i){
			npcs[i].BroadcastMessage("setToFlee");
		}
	}
	/*
	
	if(escapeCount > 30){
		var npcs : GameObject[] = GameObject.FindGameObjectsWithTag("NPC");
		for(var i = 0; i < npcs.length ; ++i){
			npcs[i].BroadcastMessage("setToFlee");
		}
	}
	*/
}

//Make Panic happen:
var panic_level : float = 0;
var panic_MAX : float = 50;
function doPanic() {
	var npcs : GameObject[] = GameObject.FindGameObjectsWithTag("NPC");
	for(var i = 0; i < npcs.length ; ++i){
		npcs[i].BroadcastMessage("panic", panic_level / panic_MAX, SendMessageOptions.DontRequireReceiver);
	}	
}

function FlamePerformed() {
	panic_level += 5;
}
function JumpPerformed() {
	panic_level += 10;
}
